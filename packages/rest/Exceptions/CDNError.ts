export class CDNError extends Error {
	/**
	 * CDNError constructor
	 * @param string message
	 * @param number code
	 */
	public constructor(message: string, code: number = 0) {
		super(`CDNError: ${message}: ${code}`);
	}
}
