export class TokenException extends Error {
	/**
	 * TokenException constructor
	 *
	 * @param error
	 * @param code
	 */
	public constructor(protected error: string, protected code?: number) {
		super(`${error} \n Code: ${code ? code : 0}`);
	}
}
