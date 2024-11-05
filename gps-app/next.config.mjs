/** @type {import('next').NextConfig} */
/** @type {import('require').NextConfig} */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const nextConfig = {
	images:{
	path: "/",},
	/*server: {
		https: {
		  key: fs.readFileSync(path.join(__dirname, 'ca.key')),
		  cert: fs.readFileSync(path.join(__dirname, 'ca.crt'))
		}
	  }*/
};

export default nextConfig;
