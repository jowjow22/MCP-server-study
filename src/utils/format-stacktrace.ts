export function formatStacktrace(event: any): string {
  if (!event || !event.entries) {
    return 'No stacktrace available';
  }
  
  const stacktrace_property = event.stacktrace;

  if (!stacktrace_property || !stacktrace_property.frames) {
    return 'No stacktrace available';
  }
  
  // Format the stacktrace
  let stacktrace = `${event.title}`
  
  if (stacktrace_property.stacktrace && stacktrace_property.stacktrace.frames) {
    // Reverse the frames to show most recent call last (like Python)
    const frames = [...stacktrace_property.stacktrace.frames].reverse();
    
    frames.forEach((frame: any, index: number) => {
      const filename = frame.filename || '<unknown>';
      const lineno = frame.lineno || '?';
      const function_name = frame.function || '<anonymous>';
      
      stacktrace += `  ${index + 1}. ${filename}:${lineno} in ${function_name}\n`;
      
      // Add context code if available
      if (frame.context_line) {
        stacktrace += `     ${frame.context_line.trim()}\n`;
      }
    });
  } else {
    stacktrace += '  No frames available\n';
  }
  
  return stacktrace;
}