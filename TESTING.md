# EnvGuard Testing Guide

This document provides information on how to test the EnvGuard extension.

## Types of Tests

The EnvGuard extension includes the following types of tests:

1. **Unit Tests**: Test individual components of the extension
2. **Integration Tests**: Test the extension as a whole in a VS Code environment

## Running Tests

### Automated Tests

To run the automated tests, use the following commands:

```bash
# Run all tests
pnpm test

# Run integration tests only
pnpm test:integration
```

### Manual Testing

For manual testing, follow these steps:

1. Press `F5` to launch a new VS Code window with the extension loaded
2. Open an `.env` file or create a new one
3. Verify that values are hidden with asterisks that match the length of the actual values
4. Use the command palette (`Ctrl+Shift+P` or `Cmd+Shift+P`) to run "EnvGuard: Toggle Environment Values Visibility"
5. Verify that all values are now visible
6. Run the command again to hide the values

## Test Cases

### Basic Functionality

- **TC-001**: Extension activates when opening an `.env` file
- **TC-002**: Values in `.env` files are hidden by default
- **TC-003**: Asterisks match the length of the hidden values
- **TC-004**: Toggle command switches between hiding and showing all values

### Configuration

- **TC-005**: Changing file patterns in settings affects which files are protected
- **TC-006**: Setting `hideValues` to false shows all values
- **TC-007**: Setting `hideValues` to true hides all values

### Edge Cases

- **TC-008**: Files with non-standard extensions but matching patterns are protected
- **TC-009**: Comments in `.env` files are not affected
- **TC-010**: Empty lines in `.env` files are not affected
- **TC-011**: Lines without equals sign are not affected

## Adding New Tests

To add new tests:

1. Create a new test file in the `src/test` directory
2. Import the necessary modules
3. Use the Mocha `suite` and `test` functions to define your tests
4. Run the tests using the commands above

## Debugging Tests

To debug tests:

1. Set breakpoints in your test files
2. Use the "Debug Tests" launch configuration
3. Examine variables and step through the code

## Continuous Integration

The tests are automatically run in the CI pipeline when changes are pushed to the repository. The pipeline will fail if any tests fail.

## Test Coverage

To generate a test coverage report:

```bash
pnpm test:coverage
```

The report will be generated in the `coverage` directory.