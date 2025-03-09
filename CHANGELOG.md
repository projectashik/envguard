# Change Log

All notable changes to the "envguard" extension will be documented in this file.

Check [Keep a Changelog](http://keepachangelog.com/) for recommendations on how to structure this file.

## [Unreleased]

- Initial release

## [0.0.1] - 2025-03-09

### Added
- Initial release of EnvGuard extension for Visual Studio Code
- Core functionality to hide sensitive values in environment files
- Support for various environment file formats (.env, .env.*, etc.)
- Global toggle command (`EnvGuard: Toggle Visibility`) to show/hide sensitive values
- Visual indicator for hidden values (gray background)
- Configurable settings:
  - `envguard.hideValues`: Enable/disable hiding of sensitive values
  - `envguard.filePatterns`: Customize which file patterns to apply the extension to

### Technical
- Built with TypeScript and VS Code Extension API
- Optimized for performance with minimal resource usage
- Compatible with VS Code 1.74.0 and higher

### Documentation
- Added comprehensive README with usage instructions
- Included USAGE.md with detailed examples
- Added TESTING.md with testing guidelines