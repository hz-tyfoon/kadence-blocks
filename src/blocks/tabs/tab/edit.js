/**
 * BLOCK: Kadence Tab
 *
 * Registering a basic block with Gutenberg.
 */
import { useEffect } from '@wordpress/element';

import { InnerBlocks, useBlockProps, useInnerBlocksProps, store as blockEditorStore } from '@wordpress/block-editor';
import { useDispatch, useSelect } from '@wordpress/data';
import { getUniqueId, getPostOrFseId } from '@kadence/helpers';

/**
 * Build the spacer edit
 */
function KadenceTab(props) {
	const { attributes, setAttributes, clientId } = props;
	const { id, uniqueID } = attributes;

	const { addUniqueID } = useDispatch('kadenceblocks/data');
	const { isUniqueID, isUniqueBlock, parentData } = useSelect(
		(select) => {
			return {
				isUniqueID: (value) => select('kadenceblocks/data').isUniqueID(value),
				isUniqueBlock: (value, clientId) => select('kadenceblocks/data').isUniqueBlock(value, clientId),
				parentData: {
					rootBlock: select('core/block-editor').getBlock(
						select('core/block-editor').getBlockHierarchyRootClientId(clientId)
					),
					postId: select('core/editor')?.getCurrentPostId()
						? select('kadence/header')?.getCurrentPostId()
						: '',
					reusableParent: select('core/block-editor').getBlockAttributes(
						select('core/block-editor')
							.getBlockParentsByBlockName(clientId, 'kadence/navigation')
							.slice(-1)[0]
					),
					editedPostId: select('core/edit-site') ? select('core/edit-site').getEditedPostId() : false,
				},
			};
		},
		[clientId]
	);

	useEffect(() => {
		const postOrFseId = getPostOrFseId(props, parentData);
		const uniqueId = getUniqueId(uniqueID, clientId, isUniqueID, isUniqueBlock, postOrFseId);

		if (uniqueId !== uniqueID) {
			attributes.uniqueID = uniqueId;
			setAttributes({ uniqueID: uniqueId });

			addUniqueID(uniqueId, clientId);
		} else {
			addUniqueID(uniqueID, clientId);
		}
	}, []);
	const hasChildBlocks = useSelect((select) => select(blockEditorStore).getBlocks(clientId).length > 0, [clientId]);
	const blockProps = useBlockProps({
		className: `kt-tab-inner-content kt-inner-tab-${id} kt-inner-tab${uniqueID}`,
	});
	const innerBlocksProps = useInnerBlocksProps(
		{
			className: 'kt-tab-inner-content-inner',
		},
		{
			templateLock: false,
			renderAppender: hasChildBlocks ? undefined : InnerBlocks.ButtonBlockAppender,
		}
	);

	return (
		<div {...blockProps} data-tab={id}>
			<div {...innerBlocksProps} />
		</div>
	);
}

export default KadenceTab;
