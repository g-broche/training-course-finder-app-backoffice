# Project Structure (Schematic)

```text
backoffice
├── public/                          	# Static assets (favicon, etc.)
├── src                              	# Application source code
│   ├── app
│   │   ├── core                     	# Core applications files used accross features
│   │   │   └── api.service.ts
│   │   ├── features                 	# Domain features + reusable shared feature UI
│   │   │   ├── announces
│   │   │   │   ├── components/			# Announce components
│   │   │   │   └── announce.service.ts 	# Announce service
│   │   │   ├── auth
│   │   │   │   ├── components/			# Auth components
│   │   │   │   ├── auth.guard.ts       	# Guard applied before routing
│   │   │   │   └── auth.service.ts		# Auth service
│   │   │   ├── categories
│   │   │   │   └── category.service.ts		# Category service
│   │   │   ├── discussions
│   │   │   │   ├── components/			# Discussion components
│   │   │   │   └── discussion.service.ts	# Discussion service
│   │   │   ├── messages
│   │   │   │   └── components/			# Message components
│   │   │   ├── shared
│   │   │   │   ├── components/			# Shared generic components
│   │   │   │   ├── services
│   │   │   │   │   └── notification.service.ts	# Service to display flash messages
│   │   │   │   └── utils
│   │   │   │       └── pipe.ts			# String formating utils for displays
│   │   │   └── users
│   │   │       ├── components/			# User components
│   │   │       ├── user.service.ts		# User service
│   │   │       └── utils.ts			# User utility functions
│   │   ├── layouts                  	# Page-level route containers
│   │   │   ├── announces/			# Announce screens
│   │   │   ├── auth/				# Auth screens
│   │   │   ├── discussions/			# Discussion screens
│   │   │   └── users				# User screens
│   │   ├── models                   	# TypeScript interfaces/types
│   │   │   └── *.model.ts
│   │   ├── app.component.html       	# Root component template
│   │   ├── app.component.scss       	# Root component styles
│   │   ├── app.component.spec.ts    	# Root component unit tests
│   │   ├── app.component.ts         	# Root component component
│   │   ├── app.config.ts            	# App-wide providers/config
│   │   └── app.routes.ts            	# Router map
│   ├── environments                 	# Environment-specific runtime config
│   │   ├── environment.development.ts
│   │   └── environment.ts
│   ├── styles                       	# Global and shared SCSS partials
│   │   ├── shared/				# shared styles 
│   │   └── _variables.scss			# scss constants	
│   ├── index.html                   	# SPA html entry point
│   ├── main.ts                      	# Angular bootstrap entry point
│   └── styles.scss                  	# Global stylesheet entry
├── .gitignore                       	# Git ignore rules
├── angular.json                     	# Angular CLI workspace/build config
├── package.json                     	# Scripts + dependencies
├── package-lock.json                	# Dependency lockfile
├── README.md                        	# Project documentation
├── tsconfig.app.json                	# TS config for app build
├── tsconfig.json                    	# Base TS config
└── tsconfig.spec.json               	# TS config for tests
```
