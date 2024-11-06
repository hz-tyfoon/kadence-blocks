/**
 * Template: Mega Menu 1
 * Post Type: kadence_navigation
 */

import { createBlock } from '@wordpress/blocks';

const postMeta = {};

function innerBlocks() {
	return [
		createBlock(
			'kadence/rowlayout',
			{
				uniqueID: '252_56a2cc-f8',
				columns: 1,
				colLayout: 'equal',
				templateLock: false,
				inheritMaxWidth: true,
				kbVersion: 2,
				padding: ['sm', 'sm', 'sm', 'sm'],
			},
			[]
		),
	];
}

export { postMeta, innerBlocks };
