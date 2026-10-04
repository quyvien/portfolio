// Run with: node --experimental-websocket tests/run-motion.mjs
// Requires the local preview server on port 4173 and Google Chrome on Windows.
import { spawn } from 'node:child_process';
import { writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
const pause = ms => new Promise(resolve => setTimeout(resolve, ms));
const browser = spawn('C:/Program Files/Google/Chrome/Application/chrome.exe', [
  '--headless', '--disable-gpu', '--no-first-run', '--remote-debugging-port=9334',
  `--user-data-dir=${resolve('.browser-test-motion-cdp')}`, 'about:blank'
], { windowsHide: true, stdio: 'ignore' });
let socket;
try {
  let tabs;
  for (let attempt = 0; attempt < 40; attempt++) {
    try { tabs = await (await fetch('http://localhost:9334/json')).json(); break; }
    catch { await pause(200); }
  }
  socket = new WebSocket(tabs.find(tab => tab.type === 'page').webSocketDebuggerUrl);
  await new Promise(resolve => socket.addEventListener('open', resolve, { once: true }));
  let id = 0;
  const pending = new Map();
  socket.addEventListener('message', event => {
    const message = JSON.parse(event.data);
    const task = pending.get(message.id);
    if (!task) return;
    pending.delete(message.id);
    if (message.error) task.reject(new Error(message.error.message)); else task.resolve(message.result);
  });
  const call = (method, params = {}) => new Promise((resolve, reject) => {
    pending.set(++id, { resolve, reject }); socket.send(JSON.stringify({ id, method, params }));
  });
  await call('Page.enable');
  for (const reduced of [false, true]) {
    await call('Emulation.setEmulatedMedia', { features: [{ name: 'prefers-reduced-motion', value: reduced ? 'reduce' : 'no-preference' }] });
    for (const suite of ['motion', 'browser']) {
      await call('Page.navigate', { url: `http://localhost:4173/tests/${suite}.html?run=${Date.now()}` });
      await pause(500);
      let state;
      for (let attempt = 0; attempt < 100; attempt++) {
        state = (await call('Runtime.evaluate', { expression: 'JSON.stringify({title:document.title,result:document.querySelector("#results")?.textContent})', returnByValue: true })).result.value;
        state = JSON.parse(state);
        if (['PASS', 'FAIL', 'ERROR'].includes(state.title)) break;
        await pause(300);
      }
      console.log(`${suite} / ${reduced ? 'reduced' : 'standard'}: ${state.title}`);
      if (state.title !== 'PASS') throw new Error(state.result);
    }
  }
  await call('Emulation.setEmulatedMedia', { features: [{ name: 'prefers-reduced-motion', value: 'no-preference' }] });
  for (const width of [1440, 390]) {
    await call('Emulation.setDeviceMetricsOverride', { width, height: 1000, deviceScaleFactor: 1, mobile: false });
    await call('Page.navigate', { url: 'http://localhost:4173/' });
    await pause(1800);
    const screenshot = await call('Page.captureScreenshot', { format: 'png' });
    await writeFile(`tests/motion-${width}.png`, Buffer.from(screenshot.data, 'base64'));
  }
  // Changing the preference during the same visit must reset all movement.
  await call('Emulation.setEmulatedMedia', { features: [{ name: 'prefers-reduced-motion', value: 'reduce' }] });
  await pause(100);
  const reset = await call('Runtime.evaluate', { expression: '!document.documentElement.classList.contains("motion-enabled") && getComputedStyle(document.querySelector(".type-line")).transform === "none" && document.getAnimations().length === 0', returnByValue: true });
  if (!reset.result.value) throw new Error('Live reduced-motion change failed');
  console.log('Live preference change: PASS; desktop and mobile screenshots saved.');
  await call('Browser.close');
} finally {
  socket?.close(); browser.kill();
}
