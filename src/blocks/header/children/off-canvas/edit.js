/**
 * BLOCK: Kadence Off Canvas block
 */

/**
 * Import Css
 */
import './editor.scss';

/**
 * External dependencies
 */
import classnames from 'classnames';

/**
 * Internal block libraries
 */
import { useSelect, useDispatch } from '@wordpress/data';
import {
	InnerBlocks,
	InspectorControls,
	useBlockProps,
	useInnerBlocksProps,
	store as blockEditorStore,
} from '@wordpress/block-editor';

import { getUniqueId, getPostOrFseId, useEditorElement, getPreviewSize } from '@kadence/helpers';
import {
	SelectParentBlock,
	KadenceRadioButtons,
	KadencePanelBody,
	PopColorControl,
	InspectorControlTabs,
	ResponsiveMeasureRangeControl,
	ResponsiveRangeControls,
	SmallResponsiveControl,
	ResponsiveAlignControls,
	ResponsiveBorderControl,
	ResponsiveMeasurementControls,
	KadenceIconPicker,
	HoverToggleControl,
	IconRender,
} from '@kadence/components';

/**
 * Internal dependencies
 */
import { useEffect, useMemo, useState, useRef } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import BackendStyles from './components/backend-styles';

export function Edit(props) {
	const { attributes, setAttributes, clientId, isSelected } = props;
	const [previewActive, setPreviewActive] = useState(false);
	const [activeTab, setActiveTab] = useState('general');

	const {
		uniqueID,
		slideFrom,
		backgroundColor,
		backgroundColorTablet,
		backgroundColorMobile,
		pageBackgroundColor,
		pageBackgroundColorTablet,
		pageBackgroundColorMobile,
		padding,
		paddingTablet,
		paddingMobile,
		paddingUnit,
		widthType,
		maxWidth,
		maxWidthTablet,
		maxWidthMobile,
		maxWidthUnit,
		containerMaxWidth,
		containerMaxWidthTablet,
		containerMaxWidthMobile,
		hAlign,
		hAlignTablet,
		hAlignMobile,
		vAlign,
		vAlignTablet,
		vAlignMobile,
		border,
		borderTablet,
		borderMobile,
		borderRadius,
		borderRadiusTablet,
		borderRadiusMobile,
		borderRadiusUnit,
		closeIcon,
		closeIconSize,
		closeIconSizeTablet,
		closeIconSizeMobile,
		closeIconColor,
		closeIconColorTablet,
		closeIconColorMobile,
		closeIconColorHover,
		closeIconColorHoverTablet,
		closeIconColorHoverMobile,
		closeIconBackgroundColor,
		closeIconBackgroundColorTablet,
		closeIconBackgroundColorMobile,
		closeIconBackgroundColorHover,
		closeIconBackgroundColorHoverTablet,
		closeIconBackgroundColorHoverMobile,
		closeIconPadding,
		closeIconPaddingTablet,
		closeIconPaddingMobile,
		closeIconPaddingUnit,
		closeIconBorder,
		closeIconBorderTablet,
		closeIconBorderMobile,
		closeIconBorderHover,
		closeIconBorderHoverTablet,
		closeIconBorderHoverMobile,
		closeIconBorderRadius,
		closeIconBorderRadiusTablet,
		closeIconBorderRadiusMobile,
		closeIconBorderRadiusUnit,
	} = attributes;

	const { addUniqueID } = useDispatch('kadenceblocks/data');
	const { selectBlock } = useDispatch(blockEditorStore);

	const { isUniqueID, isUniqueBlock, parentData, previewDevice, parentClientId } = useSelect(
		(select) => {
			const { getBlockParents, getBlockParentsByBlockName } = select(blockEditorStore);
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
				parentClientId: select('core/block-editor').getBlockParents(clientId)[0],
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

	const selfOrChildSelected = () => {
		const childSelected = useSelect((select) => select('core/block-editor').hasSelectedInnerBlock(clientId, true));
		return isSelected || childSelected;
	};

	const ref = useRef();

	const handleModalClick = (e) => {
		if (e.target.classList.contains('wp-block-kadence-off-canvas')) {
			setPreviewActive(false);
			selectBlock(parentClientId);
		}
	};

	const editorElement = useEditorElement(ref, [selfOrChildSelected, previewActive]);
	const previewCloseIconSize = getPreviewSize(previewDevice, closeIconSize, closeIconSizeTablet, closeIconSizeMobile);

	const classes = classnames('wp-block-kadence-off-canvas', `off-canvas-side-${slideFrom}`, {
		active: selfOrChildSelected() || previewActive,
		[`wp-block-kadence-off-canvas${uniqueID}`]: uniqueID,
	});

	const blockProps = useBlockProps({
		className: classes,
	});

	const innerNavClasses = classnames('kb-off-canvas-inner');

	const innerBlocksProps = useInnerBlocksProps(
		{
			className: innerNavClasses,
		},
		{
			templateLock: false,
			template: [['core/paragraph', { placeholder: __('Create Awesome', 'kadence-blocks') }]],
		}
	);

	const overlayClasses = classnames('kb-off-canvas-overlay', {
		[`kb-off-canvas-overlay${uniqueID}`]: uniqueID,
	});

	const styleColorControls = (size = '', suffix = '') => {
		const backgroundColorValue = attributes['backgroundColor' + suffix + size];
		const pageBackgroundColorValue = attributes['pageBackgroundColor' + suffix + size];
		return (
			<>
				<PopColorControl
					label={__('Background', 'kadence-blocks')}
					value={backgroundColorValue}
					default={''}
					onChange={(value) => setAttributes({ ['backgroundColor' + suffix + size]: value })}
					key={'normal'}
				/>
				{widthType === 'partial' && (
					<PopColorControl
						label={__('Page Background', 'kadence-blocks')}
						value={pageBackgroundColorValue}
						default={'rgba(0, 0, 0, 0.6)'}
						onChange={(value) => setAttributes({ ['pageBackgroundColor' + suffix + size]: value })}
						key={'normalb'}
					/>
				)}
			</>
		);
	};

	const styleColorControlsCloseIcon = (size = '', suffix = '') => {
		const closeIconColorValue = attributes['closeIconColor' + suffix + size];
		const closeIconBackgroundColorValue = attributes['closeIconBackgroundColor' + suffix + size];
		return (
			<>
				<PopColorControl
					label={__('Color', 'kadence-blocks')}
					value={closeIconColorValue}
					default={''}
					onChange={(value) => setAttributes({ ['closeIconColor' + suffix + size]: value })}
					key={'closeIcon' + suffix}
				/>
				<PopColorControl
					label={__('Background', 'kadence-blocks')}
					value={closeIconBackgroundColorValue}
					default={''}
					onChange={(value) => setAttributes({ ['closeIconBackgroundColor' + suffix + size]: value })}
					key={'closeIconb' + suffix}
				/>
			</>
		);
	};

	return (
		<>
			<InspectorControls>
				<SelectParentBlock
					label={__('View Header Settings', 'kadence-blocks')}
					clientId={clientId}
					parentSlug={'kadence/header'}
				/>

				<InspectorControlTabs panelName={'off-canvas'} setActiveTab={setActiveTab} activeTab={activeTab} />
				{activeTab === 'general' && (
					<>
						<KadencePanelBody>
							<KadenceRadioButtons
								label={__('Show Off cavnas content in editor when not selected', 'kadence-blocks')}
								value={previewActive}
								options={[
									{ value: true, label: __('Show', 'kadence-blocks') },
									{ value: false, label: __('Hide', 'kadence-blocks') },
								]}
								hideLabel={false}
								onChange={(value) => {
									setPreviewActive(value);
								}}
							/>
						</KadencePanelBody>
						<KadencePanelBody title={__('Display Settings', 'kadence-blocks')} initialOpen={true}>
							<KadenceRadioButtons
								label={__('Slide Content from', 'kadence-blocks')}
								value={slideFrom}
								options={[
									{ value: 'left', label: __('Left', 'kadence-blocks') },
									{ value: 'right', label: __('Right', 'kadence-blocks') },
								]}
								hideLabel={false}
								onChange={(value) => {
									setAttributes({ slideFrom: value });
								}}
							/>

							<KadenceRadioButtons
								label={__('Content Width', 'kadence-blocks')}
								value={widthType}
								options={[
									{ value: 'partial', label: __('Partial', 'kadence-blocks') },
									{ value: 'full', label: __('Full', 'kadence-blocks') },
								]}
								hideLabel={false}
								onChange={(value) => {
									setAttributes({ widthType: value });
								}}
							/>

							{widthType === 'partial' && (
								<ResponsiveRangeControls
									label={__('Max Width', 'kadence-blocks')}
									value={maxWidth !== 0 ? maxWidth : ''}
									onChange={(value) => setAttributes({ maxWidth: value })}
									tabletValue={maxWidthTablet ? maxWidthTablet : ''}
									onChangeTablet={(value) => setAttributes({ maxWidthTablet: value })}
									mobileValue={maxWidthMobile ? maxWidthMobile : ''}
									onChangeMobile={(value) => setAttributes({ maxWidthMobile: value })}
									min={100}
									max={1500}
									step={1}
									unit={'px'}
									showUnit={true}
									units={['px']}
									reset={() =>
										setAttributes({ maxWidth: '', maxWidthTablet: '', maxWidthMobile: '' })
									}
								/>
							)}

							<ResponsiveRangeControls
								label={__('Container Max Width', 'kadence-blocks')}
								value={containerMaxWidth ? containerMaxWidth : ''}
								onChange={(value) => setAttributes({ containerMaxWidth: value })}
								tabletValue={containerMaxWidthTablet ? containerMaxWidthTablet : ''}
								onChangeTablet={(value) => setAttributes({ containerMaxWidthTablet: value })}
								mobileValue={containerMaxWidthMobile ? containerMaxWidthMobile : ''}
								onChangeMobile={(value) => setAttributes({ containerMaxWidthMobile: value })}
								min={100}
								max={1500}
								step={1}
								unit={'px'}
								showUnit={true}
								units={['px']}
								reset={() =>
									setAttributes({
										containerMaxWidth: '',
										containerMaxWidthTablet: '',
										containerMaxWidthMobile: '',
									})
								}
							/>
							<ResponsiveAlignControls
								label={__('Alignment', 'kadence-blocks')}
								value={hAlign ? hAlign : ''}
								tabletValue={hAlignTablet ? hAlignTablet : ''}
								mobileValue={hAlignMobile ? hAlignMobile : ''}
								onChange={(nextAlign) => setAttributes({ hAlign: nextAlign ? nextAlign : 'center' })}
								onChangeTablet={(nextAlign) =>
									setAttributes({ hAlignTablet: nextAlign ? nextAlign : '' })
								}
								onChangeMobile={(nextAlign) =>
									setAttributes({ hAlignMobile: nextAlign ? nextAlign : '' })
								}
								type={'text'}
							/>
							<ResponsiveAlignControls
								label={__('Alignment', 'kadence-blocks')}
								value={vAlign ? vAlign : ''}
								tabletValue={vAlignTablet ? vAlignTablet : ''}
								mobileValue={vAlignMobile ? vAlignMobile : ''}
								onChange={(nextAlign) => setAttributes({ vAlign: nextAlign ? nextAlign : 'center' })}
								onChangeTablet={(nextAlign) =>
									setAttributes({ vAlignTablet: nextAlign ? nextAlign : '' })
								}
								onChangeMobile={(nextAlign) =>
									setAttributes({ vAlignMobile: nextAlign ? nextAlign : '' })
								}
								type={'vertical'}
							/>
						</KadencePanelBody>

						<KadencePanelBody title={__('Close Trigger Settings', 'kadence-blocks')} initialOpen={false}>
							<KadenceIconPicker
								value={closeIcon}
								onChange={(value) => setAttributes({ closeIcon: value })}
								allowClear={true}
							/>

							<ResponsiveRangeControls
								label={__('Icon Size', 'kadence-blocks')}
								value={closeIconSize}
								tabletValue={closeIconSizeTablet ? closeIconSizeTablet : ''}
								mobileValue={closeIconSizeMobile ? closeIconSizeMobile : ''}
								onChange={(value) => setAttributes({ closeIconSize: value })}
								onChangeTablet={(value) => setAttributes({ closeIconSizeTablet: value })}
								onChangeMobile={(value) => setAttributes({ closeIconSizeMobile: value })}
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
						<KadencePanelBody title={__('Close Trigger Styles', 'kadence-blocks')} initialOpen={false}>
							<HoverToggleControl
								normal={
									<>
										<SmallResponsiveControl
											label={'Colors'}
											desktopChildren={styleColorControlsCloseIcon()}
											tabletChildren={styleColorControlsCloseIcon('Tablet')}
											mobileChildren={styleColorControlsCloseIcon('Mobile')}
										></SmallResponsiveControl>
										<ResponsiveBorderControl
											label={__('Border', 'kadence-blocks')}
											value={closeIconBorder}
											tabletValue={closeIconBorderTablet}
											mobileValue={closeIconBorderMobile}
											onChange={(value) => setAttributes({ closeIconBorder: value })}
											onChangeTablet={(value) => setAttributes({ closeIconBorderTablet: value })}
											onChangeMobile={(value) => setAttributes({ closeIconBorderMobile: value })}
											key={'normalbr'}
										/>
									</>
								}
								hover={
									<>
										<SmallResponsiveControl
											label={'Hover Colors'}
											desktopChildren={styleColorControlsCloseIcon('', 'Hover')}
											tabletChildren={styleColorControlsCloseIcon('Tablet', 'Hover')}
											mobileChildren={styleColorControlsCloseIcon('Mobile', 'Hover')}
										></SmallResponsiveControl>
										<ResponsiveBorderControl
											label={__('Hover Border', 'kadence-blocks')}
											value={closeIconBorderHover}
											tabletValue={closeIconBorderHoverTablet}
											mobileValue={closeIconBorderHoverMobile}
											onChange={(value) => setAttributes({ closeIconBorderHover: value })}
											onChangeTablet={(value) =>
												setAttributes({ closeIconBorderHoverTablet: value })
											}
											onChangeMobile={(value) =>
												setAttributes({ closeIconBorderHoverMobile: value })
											}
											key={'normalbrhv'}
										/>
									</>
								}
							/>

							<ResponsiveMeasurementControls
								label={__('Border Radius', 'kadence-blocks')}
								value={closeIconBorderRadius}
								tabletValue={closeIconBorderRadiusTablet}
								mobileValue={closeIconBorderRadiusMobile}
								onChange={(value) => setAttributes({ closeIconBorderRadius: value })}
								onChangeTablet={(value) => setAttributes({ closeIconBorderRadiusTablet: value })}
								onChangeMobile={(value) => setAttributes({ closeIconBorderRadiusMobile: value })}
								min={0}
								max={
									closeIconBorderRadiusUnit === 'em' || closeIconBorderRadiusUnit === 'rem' ? 24 : 100
								}
								step={
									closeIconBorderRadiusUnit === 'em' || closeIconBorderRadiusUnit === 'rem' ? 0.1 : 1
								}
								unit={closeIconBorderRadiusUnit}
								units={['px', 'em', 'rem', '%']}
								onUnit={(value) => setAttributes({ closeIconBorderRadiusUnit: value })}
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
								onChange={(value) => {
									setAttributes({ padding: value });
								}}
								onChangeTablet={(value) => setAttributes({ paddingTablet: value })}
								onChangeMobile={(value) => setAttributes({ paddingMobile: value })}
								min={paddingUnit === 'em' || paddingUnit === 'rem' ? -12 : -999}
								max={paddingUnit === 'em' || paddingUnit === 'rem' ? 24 : 999}
								step={paddingUnit === 'em' || paddingUnit === 'rem' ? 0.1 : 1}
								unit={paddingUnit}
								units={['px', 'em', 'rem', '%', 'vh']}
								onUnit={(value) => setAttributes({ paddingUnit: value })}
								allowAuto={true}
							/>
						</KadencePanelBody>
						<KadencePanelBody title={__('Close Trigger Spacing', 'kadence-blocks')} initialOpen={false}>
							<ResponsiveMeasureRangeControl
								label={__('Padding', 'kadence-blocks')}
								value={closeIconPadding}
								tabletValue={closeIconPaddingTablet}
								mobileValue={closeIconPaddingMobile}
								onChange={(value) => setAttributes({ closeIconPadding: value })}
								onChangeTablet={(value) => setAttributes({ closeIconPaddingTablet: value })}
								onChangeMobile={(value) => setAttributes({ closeIconPaddingMobile: value })}
								min={0}
								max={closeIconPaddingUnit === 'em' || closeIconPaddingUnit === 'rem' ? 25 : 400}
								step={closeIconPaddingUnit === 'em' || closeIconPaddingUnit === 'rem' ? 0.1 : 1}
								unit={closeIconPaddingUnit}
								units={['px', 'em', 'rem', '%']}
								onUnit={(value) => setAttributes({ closeIconPaddingUnit: value })}
							/>
						</KadencePanelBody>
					</>
				)}
			</InspectorControls>
			<BackendStyles {...props} previewDevice={previewDevice} editorElement={editorElement} />
			<div {...blockProps} onClick={(e) => handleModalClick(e)} ref={ref}>
				{closeIcon && previewCloseIconSize && (
					<button className="kb-off-canvas-close">
						<IconRender
							className={`kb-off-canvas-close-icon`}
							name={closeIcon}
							size={previewCloseIconSize}
						/>
					</button>
				)}
				{/* <div className="kb-off-canvas-label">{__('Off Canvas Content', 'kadence-blocks')}</div> */}
				<div {...innerBlocksProps} />
			</div>
			<div className={overlayClasses}></div>
		</>
	);
}

export default Edit;