#!/usr/bin/env node
const { spawn } = require('child_process');
const path = require('path');

const electronPath = require('electron');
const appPath = path.join(__dirname, '..');

spawn(electronPath, [appPath], {
    stdio: 'inherit',
    detached: true
}).unref();
