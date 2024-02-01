# Firefight Central
This is just a project that I am doing for my hometown fire station to replace software that is no longer suitable for their needs. Nothing special, move along. 

## Setup
Project requires [rustlang](https://www.rust-lang.org/) and [node](https://nodejs.org/en)

This project uses aws polly to synthesize audio, which requires an aws account and keys. The feature is not required for the project to run but a configuration file is required for the build, please follow the instructions below

- Create a file ./src-tauri/src/polly/config.rs
- Insert the following content
```
pub const AWS_ACCESS_KEY_ID: &str = "";
pub const AWS_SECRET_ACCESS_KEY: &str = "";
```
- If audio synthesis is required fill in the values above with your own keys


## Development
To run in development mode use the command
```
yarn tauri dev
```

## Release
#### Preparation
To prepare the project change the following values
- In ./src-tauri/tauri.config.json replace 'productName', 'version', 'identifier' to your desired values
- Also in ./src-tauri/tauri.config.json deactivate or replace the values under the updater as keeping these will link to my updates and you will get a private key warning when building. This is just an incovenience as your release version will still work, but not be signed.

#### Building
To create a release version run the following command
```
yarn tauri build
```
