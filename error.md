2026-04-05T20:11:15.677Z	Initializing build environment...
2026-04-05T20:11:17.477Z	Success: Finished initializing build environment
2026-04-05T20:11:19.050Z	Cloning repository...
2026-04-05T20:11:20.008Z	Restoring from dependencies cache
2026-04-05T20:11:20.010Z	Restoring from build output cache
2026-04-05T20:11:20.015Z	Detected the following tools from environment: npm@10.9.2, nodejs@22.16.0
2026-04-05T20:11:23.659Z	Success: Dependencies restored from build cache.
2026-04-05T20:11:23.660Z	Installing project dependencies: npm clean-install --progress=false
2026-04-05T20:11:24.739Z	
2026-04-05T20:11:24.743Z	added 30 packages, and audited 31 packages in 732ms
2026-04-05T20:11:24.744Z	
2026-04-05T20:11:24.744Z	5 packages are looking for funding
2026-04-05T20:11:24.744Z	  run `npm fund` for details
2026-04-05T20:11:24.744Z	
2026-04-05T20:11:24.744Z	found 0 vulnerabilities
2026-04-05T20:11:24.982Z	Executing user build command: npm run build
2026-04-05T20:11:25.204Z	
2026-04-05T20:11:25.204Z	> campus-netra@1.0.0 build
2026-04-05T20:11:25.204Z	> npm install && cd client && npm install && npm run build
2026-04-05T20:11:25.204Z	
2026-04-05T20:11:25.672Z	
2026-04-05T20:11:25.672Z	up to date, audited 31 packages in 363ms
2026-04-05T20:11:25.672Z	
2026-04-05T20:11:25.673Z	5 packages are looking for funding
2026-04-05T20:11:25.673Z	  run `npm fund` for details
2026-04-05T20:11:25.673Z	
2026-04-05T20:11:25.673Z	found 0 vulnerabilities
2026-04-05T20:11:27.695Z	npm error code ERESOLVE
2026-04-05T20:11:27.695Z	npm error ERESOLVE could not resolve
2026-04-05T20:11:27.695Z	npm error
2026-04-05T20:11:27.695Z	npm error While resolving: @tailwindcss/vite@4.2.1
2026-04-05T20:11:27.696Z	npm error Found: vite@8.0.3
2026-04-05T20:11:27.696Z	npm error node_modules/vite
2026-04-05T20:11:27.696Z	npm error   dev vite@"^8.0.3" from the root project
2026-04-05T20:11:27.696Z	npm error
2026-04-05T20:11:27.696Z	npm error Could not resolve dependency:
2026-04-05T20:11:27.696Z	npm error peer vite@"^5.2.0 || ^6 || ^7" from @tailwindcss/vite@4.2.1
2026-04-05T20:11:27.696Z	npm error node_modules/@tailwindcss/vite
2026-04-05T20:11:27.696Z	npm error   dev @tailwindcss/vite@"^4.2.1" from the root project
2026-04-05T20:11:27.696Z	npm error
2026-04-05T20:11:27.696Z	npm error Conflicting peer dependency: vite@7.3.1
2026-04-05T20:11:27.697Z	npm error node_modules/vite
2026-04-05T20:11:27.697Z	npm error   peer vite@"^5.2.0 || ^6 || ^7" from @tailwindcss/vite@4.2.1
2026-04-05T20:11:27.697Z	npm error   node_modules/@tailwindcss/vite
2026-04-05T20:11:27.697Z	npm error     dev @tailwindcss/vite@"^4.2.1" from the root project
2026-04-05T20:11:27.697Z	npm error
2026-04-05T20:11:27.697Z	npm error Fix the upstream dependency conflict, or retry
2026-04-05T20:11:27.697Z	npm error this command with --force or --legacy-peer-deps
2026-04-05T20:11:27.697Z	npm error to accept an incorrect (and potentially broken) dependency resolution.
2026-04-05T20:11:27.697Z	npm error
2026-04-05T20:11:27.697Z	npm error
2026-04-05T20:11:27.697Z	npm error For a full report see:
2026-04-05T20:11:27.697Z	npm error /opt/buildhome/.npm/_logs/2026-04-05T20_11_25_776Z-eresolve-report.txt
2026-04-05T20:11:27.697Z	npm error A complete log of this run can be found in: /opt/buildhome/.npm/_logs/2026-04-05T20_11_25_776Z-debug-0.log
2026-04-05T20:11:27.738Z	Failed: error occurred while running build command