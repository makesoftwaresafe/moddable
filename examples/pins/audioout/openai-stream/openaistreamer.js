/*
 * Copyright (c) 2024  Moddable Tech, Inc.
 *
 *   This file is part of the Moddable SDK Runtime.
 * 
 *   The Moddable SDK Runtime is free software: you can redistribute it and/or modify
 *   it under the terms of the GNU Lesser General Public License as published by
 *   the Free Software Foundation, either version 3 of the License, or
 *   (at your option) any later version.
 * 
 *   The Moddable SDK Runtime is distributed in the hope that it will be useful,
 *   but WITHOUT ANY WARRANTY; without even the implied warranty of
 *   MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *   GNU Lesser General Public License for more details.
 * 
 *   You should have received a copy of the GNU Lesser General Public License
 *   along with the Moddable SDK Runtime.  If not, see <http://www.gnu.org/licenses/>.
 *
 */

import MP3Streamer from "mp3streamer";
import WavStreamer from "wavstreamer";

// https://platform.openai.com/docs/api-reference/audio/createSpeech

export default class {
	constructor(options) {
		const {key, model, voice, input, speed, response_format, ...o} = options;
		const request = {
			input,
			model,
			voice,
			speed: speed ?? 1,
			response_format: response_format ?? "mp3",
		};
		const body = ArrayBuffer.fromString(JSON.stringify(request));
		let streamer;
		if (request.response_format == "mp3") {
			streamer = MP3Streamer;
		} else if (request.response_format == "wav") {
			streamer = WavStreamer;
		} else {
			throw new Error(`invalid response_format:${request.response_format}`);
		}
	
		return new streamer({
			...o,
			http: device.network.https,
			request: {
				method: 'POST',
				headers: new Map([
					["content-type", "application/json"],
					["Authorization", `Bearer ${key}`],
					['content-length', body.byteLength.toString()],
				]),
				onWritable(count) {
					this.position ??= 0;
					this.write(body.slice(this.position, this.position + count))
					this.position += count
				},
			},
			port: 443,
			host: "api.openai.com",
			path: "/v1/audio/speech",
			waveHeaderBytes: request.response_format == "wav" ? 44 : undefined,
		})
	}
}
