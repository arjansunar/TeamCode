export interface ExecutionResults {
  stdout: string;
  time: string;
  memory: number;
  stderr: string;
  token: string;
  compile_output: string;
  message: string;
  status: Status;
}

export interface Status {
  id: number;
  description: string;
}
