# EnvGuard Usage Guide

## Getting Started

EnvGuard automatically protects sensitive information in your environment files by hiding values while you work.

### Basic Usage

1. **Install the Extension**: Install EnvGuard from the VS Code marketplace
2. **Open an Environment File**: Open any `.env` file or file matching your configured patterns
3. **Values are Hidden**: Notice that all values are automatically hidden with asterisks that match the length of the actual values
4. **Toggle All Values**: Use the command palette (`Ctrl+Shift+P` or `Cmd+Shift+P`) and search for "EnvGuard: Toggle Environment Values Visibility"

### Configuration

You can customize EnvGuard through VS Code settings:

1. Open VS Code settings (`Ctrl+,` or `Cmd+,`)
2. Search for "EnvGuard"
3. Adjust the following settings:
   - **File Patterns**: Add or remove file patterns that should be protected
   - **Hide Values**: Enable or disable value hiding globally

### Default File Patterns

By default, EnvGuard protects the following file patterns:
- `.env`
- `.env.*` (e.g., `.env.local`, `.env.production`, etc.)

### Adding Custom File Patterns

To add custom file patterns:

1. Open VS Code settings
2. Find "EnvGuard: File Patterns"
3. Add your custom patterns to the array

## Troubleshooting

### Values Not Being Hidden

If values are not being hidden:

1. Check that the file name matches one of your configured patterns
2. Ensure that the "Hide Values" setting is enabled
3. Try running the "EnvGuard: Toggle Environment Values Visibility" command

### Extension Not Activating

The extension activates for files with the following language identifiers:
- dotenv
- properties
- plaintext

If your file has a different language identifier, you may need to change it or add a custom file pattern.

## Feedback and Support

If you encounter any issues or have suggestions for improvement, please submit them on the [GitHub repository](https://github.com/projectashik/envguard).