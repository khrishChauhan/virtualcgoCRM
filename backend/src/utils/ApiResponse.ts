/**
 * Wraps a value in a standardized API success response envelope.
 *
 * Usage:
 *   res.status(200).json(ApiResponse.success(data, 'Fetched successfully'));
 */
export class ApiResponse<T = unknown> {
  public readonly status: 'success';
  public readonly message: string;
  public readonly data: T;
  public readonly timestamp: string;

  constructor(data: T, message: string = 'Success') {
    this.status = 'success';
    this.message = message;
    this.data = data;
    this.timestamp = new Date().toISOString();
  }

  static success<T>(data: T, message: string = 'Success'): ApiResponse<T> {
    return new ApiResponse<T>(data, message);
  }
}
