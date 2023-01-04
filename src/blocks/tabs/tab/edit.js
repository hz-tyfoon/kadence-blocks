/**
 * BLOCK: Kadence Tab
 *
 * Registering a basic block with Gutenberg.
 */
import { useEffect } from '@wordpress/element';

import {
	InnerBlocks,
	useBlockProps
} from '@wordpress/block-editor';

import {
	getUniqueId,
} from '@kadence/helpers';

import { useSelect, useDispatch } from '@wordpress/data';

/**
 * Build the spacer edit
 */
function KadenceTab( { attributes, setAttributes, clientId } ) {

	const { id, uniqueID } = attributes;

	const { addUniqueID } = useDispatch( 'kadenceblocks/data' );
	const { isUniqueID, isUniqueBlock } = useSelect(
		( select ) => {
			return {
				isUniqueID: ( value ) => select( 'kadenceblocks/data' ).isUniqueID( value ),
				isUniqueBlock: ( value, clientId ) => select( 'kadenceblocks/data' ).isUniqueBlock( value, clientId ),
			};
		},
		[ clientId ]
	);

	useEffect( () => {
		let uniqueId = getUniqueId( uniqueID, clientId, isUniqueID, isUniqueBlock );
		setAttributes( { uniqueID: uniqueId } );
		addUniqueID( uniqueId, clientId );
	}, [] );

	const hasChildBlocks = wp.data.select( 'core/block-editor' ).getBlockOrder( clientId ).length > 0;

	const blockProps = useBlockProps( {
		className: `kt-tab-inner-content kt-inner-tab-${id} kt-inner-tab${uniqueID}`
	} );

	return (
		<div {...blockProps} data-tab={id}>
			<InnerBlocks
				templateLock={false}
				renderAppender={(
					hasChildBlocks ?
						undefined :
						() => <InnerBlocks.ButtonBlockAppender/>
				)}/>
		</div>
	);
}

export default ( KadenceTab );
