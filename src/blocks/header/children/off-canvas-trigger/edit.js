/**
 * BLOCK: Kadence Off Canvas Trigger
 */

/**
 * Import Css
 */
import './editor.scss';
import './style.scss';

/**
 * External dependencies
 */
import classnames from 'classnames';

/**
 * Internal block libraries
 */
import { useSelect, useDispatch } from '@wordpress/data';
import { useBlockProps, InspectorControls } from '@wordpress/block-editor';

import { getUniqueId, getPostOrFseId, getPreviewSize } from '@kadence/helpers';
import {
	SelectParentBlock,
	IconRender,
	KadenceIconPicker,
	KadencePanelBody,
	PopColorControl,
	SmallResponsiveControl,
	ResponsiveMeasureRangeControl,
	ResponsiveRangeControls,
	InspectorControlTabs,
	HoverToggleControl,
	ResponsiveBorderControl,
	ResponsiveMeasurementControls,
} from '@kadence/components';

/**
 * Internal dependencies
 */
import { useEffect, useState } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import BackendStyles from './components/backend-styles';

export function Edit(props) {
	const { attributes, setAttributes, clientId } = props;

	const {
		uniqueID,
		icon,
		iconSize,
		iconSizeTablet,
		iconSizeMobile,
		iconColor,
		iconColorTablet,
		iconColorMobile,
		iconColorHover,
		iconColorHoverTablet,
		iconColorHoverMobile,
		iconBackgroundColor,
		iconBackgroundColorTablet,
		iconBackgroundColorMobile,
		iconBackgroundColorHover,
		iconBackgroundColorHoverTablet,
		iconBackgroundColorHoverMobile,
		label,
		padding,
		paddingTablet,
		paddingMobile,
		paddingUnit,
		margin,
		marginTablet,
		marginMobile,
		marginUnit,
		border,
		borderTablet,
		borderMobile,
		borderHover,
		borderHoverTablet,
		borderHoverMobile,
		borderRadius,
		borderRadiusTablet,
		borderRadiusMobile,
		borderRadiusUnit,
	} = attributes;

	const [activeTab, setActiveTab] = useState('general');
	const { addUniqueID } = useDispatch('kadenceblocks/data');
	const { isUniqueID, isUniqueBlock, parentData, previewDevice } = useSelect(
		(select) => {
			return {
				previewDevice: select('kadenceblocks/data').getPreviewDeviceType(),
				isUniqueID: (value) => select('kadenceblocks/data').isUniqueID(value),
				isUniqueBlock: (value, clientId) => select('kadenceblocks/data').isUniqueBlock(value, clientId),
				parentData: {
					rootBlock: select('core/block-editor').getBlock(
						select('core/block-editor').getBlockHierarchyRootClientId(clientId)
					),
					postId: select('core/editor')?.getCurrentPostId() ? select('core/editor')?.getCurrentPostId() : '',
					reusableParent: select('core/block-editor').getBlockAttributes(
						select('core/block-editor').getBlockParentsByBlockName(clientId, 'core/block').slice(-1)[0]
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
			addUniqueID(uniqueId, clientId);
		}
	}, []);

	const styleColorControls = (size = '', suffix = '') => {
		const iconColorValue = attributes['iconColor' + suffix + size];
		const iconBackgroundColorValue = attributes['iconBackgroundColor' + suffix + size];
		return (
			<>
				<PopColorControl
					label={__('Color', 'kadence-blocks')}
					value={iconColorValue}
					default={''}
					onChange={(value) => setAttributes({ ['iconColor' + suffix + size]: value })}
					key={'normal'}
				/>
				<PopColorControl
					label={__('Background', 'kadence-blocks')}
					value={iconBackgroundColorValue}
					default={''}
					onChange={(value) => setAttributes({ ['iconBackgroundColor' + suffix + size]: value })}
					key={'normalb'}
				/>
			</>
		);
	};

	const previewIconSize = getPreviewSize(previewDevice, iconSize, iconSizeTablet, iconSizeMobile);

	const classes = classnames('wp-block-kadence-off-canvas-trigger', {
		[`wp-block-kadence-off-canvas-trigger${uniqueID}`]: uniqueID,
	});

	const blockProps = useBlockProps({
		className: classes,
	});

	return (
		<button {...blockProps}>
			<InspectorControls>
				<SelectParentBlock
					label={__('View Header Settings', 'kadence-blocks')}
					clientId={clientId}
					parentSlug={'kadence/header'}
				/>
				<InspectorControlTabs panelName={'off-canvas'} setActiveTab={setActiveTab} activeTab={activeTab} />
				{activeTab === 'general' && (
					<>
						<KadencePanelBody title={__('Icon Settings', 'kadence-blocks')} initialOpen={true}>
							<KadenceIconPicker
								value={icon}
								onChange={(value) => setAttributes({ icon: value })}
								allowClear={true}
							/>

							<ResponsiveRangeControls
								label={__('Icon Size', 'kadence-blocks')}
								value={iconSize}
								tabletValue={iconSizeTablet ? iconSizeTablet : ''}
								mobileValue={iconSizeMobile ? iconSizeMobile : ''}
								onChange={(value) => setAttributes({ iconSize: value })}
								onChangeTablet={(value) => setAttributes({ iconSizeTablet: value })}
								onChangeMobile={(value) => setAttributes({ iconSizeMobile: value })}
								units={['px']}
								unit={'px'}
								min={5}
								max={250}
								step={1}
							/>
						</KadencePanelBody>
					</>
				)}
				{activeTab === 'style' && (
					<>
						<KadencePanelBody>
							<HoverToggleControl
								normal={
									<>
										<SmallResponsiveControl
											label={'Colors'}
											desktopChildren={styleColorControls()}
											tabletChildren={styleColorControls('Tablet')}
											mobileChildren={styleColorControls('Mobile')}
										></SmallResponsiveControl>
										<ResponsiveBorderControl
											label={__('Border', 'kadence-blocks')}
											value={border}
											tabletValue={borderTablet}
											mobileValue={borderMobile}
											onChange={(value) => setAttributes({ border: value })}
											onChangeTablet={(value) => setAttributes({ borderTablet: value })}
											onChangeMobile={(value) => setAttributes({ borderMobile: value })}
											key={'normalbr'}
										/>
									</>
								}
								hover={
									<>
										<SmallResponsiveControl
											label={'Hover Colors'}
											desktopChildren={styleColorControls('', 'Hover')}
											tabletChildren={styleColorControls('Tablet', 'Hover')}
											mobileChildren={styleColorControls('Mobile', 'Hover')}
										></SmallResponsiveControl>
										<ResponsiveBorderControl
											label={__('Hover Border', 'kadence-blocks')}
											value={borderHover}
											tabletValue={borderHoverTablet}
											mobileValue={borderHoverMobile}
											onChange={(value) => setAttributes({ borderHover: value })}
											onChangeTablet={(value) => setAttributes({ borderHoverTablet: value })}
											onChangeMobile={(value) => setAttributes({ borderHoverMobile: value })}
											key={'normalbrhv'}
										/>
									</>
								}
							/>

							<ResponsiveMeasurementControls
								label={__('Border Radius', 'kadence-blocks')}
								value={borderRadius}
								tabletValue={borderRadiusTablet}
								mobileValue={borderRadiusMobile}
								onChange={(value) => setAttributes({ borderRadius: value })}
								onChangeTablet={(value) => setAttributes({ borderRadiusTablet: value })}
								onChangeMobile={(value) => setAttributes({ borderRadiusMobile: value })}
								min={0}
								max={borderRadiusUnit === 'em' || borderRadiusUnit === 'rem' ? 24 : 100}
								step={borderRadiusUnit === 'em' || borderRadiusUnit === 'rem' ? 0.1 : 1}
								unit={borderRadiusUnit}
								units={['px', 'em', 'rem', '%']}
								onUnit={(value) => setAttributes({ borderRadiusUnit: value })}
								isBorderRadius={true}
								allowEmpty={true}
							/>
						</KadencePanelBody>
					</>
				)}
				{activeTab === 'advanced' && (
					<>
						<KadencePanelBody>
							<ResponsiveMeasureRangeControl
								label={__('Padding', 'kadence-blocks')}
								value={padding}
								tabletValue={paddingTablet}
								mobileValue={paddingMobile}
								onChange={(value) => setAttributes({ padding: value })}
								onChangeTablet={(value) => setAttributes({ paddingTablet: value })}
								onChangeMobile={(value) => setAttributes({ paddingMobile: value })}
								min={0}
								max={paddingUnit === 'em' || paddingUnit === 'rem' ? 25 : 400}
								step={paddingUnit === 'em' || paddingUnit === 'rem' ? 0.1 : 1}
								unit={paddingUnit}
								units={['px', 'em', 'rem', '%']}
								onUnit={(value) => setAttributes({ paddingUnit: value })}
							/>
							<ResponsiveMeasureRangeControl
								label={__('Margin', 'kadence-blocks')}
								value={margin}
								tabletValue={marginTablet}
								mobileValue={marginMobile}
								onChange={(value) => setAttributes({ margin: value })}
								onChangeTablet={(value) => setAttributes({ marginTablet: value })}
								onChangeMobile={(value) => setAttributes({ marginMobile: value })}
								min={0}
								max={marginUnit === 'em' || marginUnit === 'rem' ? 25 : 400}
								step={marginUnit === 'em' || marginUnit === 'rem' ? 0.1 : 1}
								unit={marginUnit}
								units={['px', 'em', 'rem', '%']}
								onUnit={(value) => setAttributes({ marginUnit: value })}
							/>
						</KadencePanelBody>
					</>
				)}
			</InspectorControls>
			<BackendStyles {...props} previewDevice={previewDevice} />

			{icon && previewIconSize && (
				<IconRender className={`kb-off-canvas-trigger-icon`} name={icon} size={previewIconSize} />
			)}
		</button>
	);
}

export default Edit;