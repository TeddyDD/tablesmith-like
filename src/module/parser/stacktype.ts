/** STACK_TYPE describes what a stack represents. */
enum STACK_TYPE {
  RANGE,
  GROUP_CALL,
  FUNCTION,
  VARIABLE_GET,
  VARIABLE_SET,
}

export default STACK_TYPE;
