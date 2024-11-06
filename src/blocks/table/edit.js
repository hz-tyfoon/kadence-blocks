import { __ } from '@wordpress/i18n';
import { useState, useEffect } from '@wordpress/element';
import { useSelect, useDispatch } from '@wordpress/data';
import { useBlockProps, BlockControls, InnerBlocks, useInnerBlocksProps } from '@wordpress/block-editor';
import classnames from 'classnames';
import metadata from './block.json';
import './editor.scss';
import { createBlock } from '@wordpress/blocks';

import {
	RangeControl,
	ToggleControl,
	TextControl,
	Modal,
	SelectControl,
	FormFileUpload,
	Button,
	Notice,
	__experimentalNumberControl as NumberControl,
} from '@wordpress/components';

import {
	KadenceSelectPosts,
	KadencePanelBody,
	InspectorControlTabs,
	KadenceInspectorControls,
	KadenceBlockDefaults,
	ResponsiveMeasureRangeControl,
	SpacingVisualizer,
	CopyPasteAttributes,
	TypographyControls,
	HoverToggleControl,
	PopColorControl,
	ResponsiveMeasurementControls,
	ResponsiveBorderControl,
	ResponsiveRangeControls,
} from '@kadence/components';

import {
	setBlockDefaults,
	mouseOverVisualizer,
	getSpacingOptionOutput,
	getUniqueId,
	getPostOrFseId,
	getPreviewSize,
} from '@kadence/helpers';
import BackendStyles from './components/backend-styles';

export function Edit(props) {
	const { attributes, setAttributes, className, clientId } = props;

	const {
		uniqueID,
		rows,
		columns,
		dataTypography,
		headerTypography,
		evenOddBackground,
		backgroundColorEven,
		backgroundColorOdd,
		backgroundHoverColorEven,
		backgroundHoverColorOdd,
		columnBackgrounds,
		columnBackgroundsHover,
		borderStyle,
		tabletBorderStyle,
		mobileBorderStyle,
		borderOnRowOnly,
		stickyFirstRow,
		stickyFirstColumn,
		maxWidth,
		maxWidthUnit,
		maxHeight,
		maxHeightUnit,
	} = attributes;

	const { addUniqueID } = useDispatch('kadenceblocks/data');
	const { isUniqueID, isUniqueBlock, previewDevice, parentData } = useSelect(
		(select) => {
			return {
				isUniqueID: (value) => select('kadenceblocks/data').isUniqueID(value),
				isUniqueBlock: (value, clientId) => select('kadenceblocks/data').isUniqueBlock(value, clientId),
				previewDevice: select('kadenceblocks/data').getPreviewDeviceType(),
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

	const { replaceInnerBlocks } = useDispatch('core/block-editor');

	const [activeTab, setActiveTab] = useState('general');

	const nonTransAttrs = [];

	const classes = classnames(
		{
			'kb-table-container': true,
			[`kb-table-container${uniqueID}`]: uniqueID,
		},
		className
	);
	const blockProps = useBlockProps({
		className: classes,
	});

	useEffect(() => {
		setBlockDefaults('kadence/table', attributes);

		if (uniqueID === undefined) {
			updateRowsColumns(rows, columns);
		}

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

	const updateColumnBackground = (index, color, isHover = false) => {
		const arrayToUpdate = isHover ? [...columnBackgroundsHover] : [...columnBackgrounds];
		if (color === '') {
			delete arrayToUpdate[index];
			arrayToUpdate.length = arrayToUpdate.length || index + 1;
		} else {
			arrayToUpdate[index] = color;
		}
		setAttributes({
			[isHover ? 'columnBackgroundsHover' : 'columnBackgrounds']: arrayToUpdate,
		});
	};

	const getColumnBackground = (index, isHover = false) => {
		const array = isHover ? columnBackgroundsHover : columnBackgrounds;
		return array && array[index] ? array[index] : '';
	};

	const updateRowsColumns = (newRows, newColumns) => {
		const currentBlocks = wp.data.select('core/block-editor').getBlocks(clientId);

		let newRowBlocks = [...currentBlocks];

		if (newRows > rows && newRows !== 0) {
			const additionalRows = Array(Math.max(1, newRows - currentBlocks.length))
				.fill()
				.map(() => {
					return createBlock(
						'kadence/table-row',
						{ columns: newColumns },
						Array(newColumns)
							.fill()
							.map(() => createBlock('kadence/table-data', {}))
					);
				});
			newRowBlocks = [...newRowBlocks, ...additionalRows];
		} else if (newRows < rows && newRows !== 0) {
			newRowBlocks = newRowBlocks.slice(0, newRows);
		}

		if (newColumns !== columns) {
			newRowBlocks = newRowBlocks.map((rowBlock) => {
				if (rowBlock.attributes.columns === newColumns) {
					return rowBlock;
				}
				return {
					...rowBlock,
					attributes: { ...rowBlock.attributes, columns: newColumns },
				};
			});
		}

		replaceInnerBlocks(clientId, newRowBlocks, false);
		setAttributes({ rows: newRows, columns: newColumns });
	};

	const innerBlocksProps = useInnerBlocksProps(
		{
			className: classnames(
				{
					'kb-table': true,
					[`kb-table${uniqueID}`]: uniqueID,
				},
				className
			),
			style: {},
		},
		{
			allowedBlocks: ['kadence/table-row'],
			templateLock: true,
			template: [
				['kadence/table-row', { columns: 2 }],
				['kadence/table-row', { columns: 2 }],
			],
			renderAppender: false,
			templateInsertUpdatesSelection: true,
		}
	);

	const saveDataTypography = (value) => {
		setAttributes({
			dataTypography: [{ ...dataTypography[0], ...value }, ...dataTypography.slice(1)],
		});
	};

	const saveHeaderTypography = (value) => {
		setAttributes({
			headerTypography: [{ ...headerTypography[0], ...value }, ...headerTypography.slice(1)],
		});
	};

	return (
		<div {...blockProps}>
			<BlockControls>
				<CopyPasteAttributes
					attributes={attributes}
					excludedAttrs={nonTransAttrs}
					defaultAttributes={metadata.attributes}
					blockSlug={metadata.name}
					onPaste={(attributesToPaste) => setAttributes(attributesToPaste)}
				/>
			</BlockControls>
			<KadenceInspectorControls blockSlug={'kadence/lottie'}>
				<InspectorControlTabs panelName={'lottie'} setActiveTab={setActiveTab} activeTab={activeTab} />

				{activeTab === 'general' && (
					<>
						<KadencePanelBody
							title={__('Table Structure', 'kadence-blocks')}
							initialOpen={true}
							panelName={'tableStructure'}
							blockSlug={'kadence/table'}
						>
							<NumberControl
								label={__('Number of Rows', 'kadence-blocks')}
								value={rows}
								onChange={(newRows) => updateRowsColumns(newRows, columns)}
								min={1}
								max={50}
							/>
							<NumberControl
								label={__('Number of Columns', 'kadence-blocks')}
								value={columns}
								onChange={(newColumns) => updateRowsColumns(rows, newColumns)}
								min={1}
								max={20}
							/>
						</KadencePanelBody>
						<KadencePanelBody
							title={__('Sticky Settings', 'kadence-blocks')}
							panelName={'sticky-settings'}
							initialOpen={false}
						>
							<ToggleControl
								label={__('Sticky first row', 'kadence-blocks')}
								checked={stickyFirstRow}
								onChange={(value) => setAttributes({ stickyFirstRow: value })}
								help={__('Max height must be set for this to apply.', 'kadence-blocks')}
							/>

							<ToggleControl
								label={__('Sticky first column', 'kadence-blocks')}
								checked={stickyFirstColumn}
								onChange={(value) => setAttributes({ stickyFirstColumn: value })}
								help={__('Max width must be set for this to apply.', 'kadence-blocks')}
							/>
						</KadencePanelBody>
						<KadencePanelBody
							title={__('Sizing', 'kadnece-blocks')}
							panelName={'sizing'}
							initialOpen={false}
						>
							<ResponsiveRangeControls
								label={__('Max Width', 'kadence-blocks')}
								value={undefined !== maxWidth && undefined !== maxWidth[0] ? maxWidth[0] : ''}
								onChange={(value) => {
									setAttributes({
										maxWidth: [
											value,
											undefined !== maxWidth && undefined !== maxWidth[1] ? maxWidth[1] : '',
											undefined !== maxWidth && undefined !== maxWidth[2] ? maxWidth[2] : '',
										],
									});
								}}
								tabletValue={undefined !== maxWidth && undefined !== maxWidth[1] ? maxWidth[1] : ''}
								onChangeTablet={(value) => {
									setAttributes({
										maxWidth: [
											undefined !== maxWidth && undefined !== maxWidth[0] ? maxWidth[0] : '',
											value,
											undefined !== maxWidth && undefined !== maxWidth[2] ? maxWidth[2] : '',
										],
									});
								}}
								mobileValue={undefined !== maxWidth && undefined !== maxWidth[2] ? maxWidth[2] : ''}
								onChangeMobile={(value) => {
									setAttributes({
										maxWidth: [
											undefined !== maxWidth && undefined !== maxWidth[0] ? maxWidth[0] : '',
											undefined !== maxWidth && undefined !== maxWidth[1] ? maxWidth[1] : '',
											value,
										],
									});
								}}
								min={0}
								max={maxWidthUnit === 'px' ? 2000 : 100}
								step={1}
								unit={maxWidthUnit ? maxWidthUnit : '%'}
								onUnit={(value) => {
									setAttributes({ maxWidthUnit: value });
								}}
								units={['px', '%', 'vw']}
							/>

							<ResponsiveRangeControls
								label={__('Max Height', 'kadence-blocks')}
								value={undefined !== maxHeight && undefined !== maxHeight[0] ? maxHeight[0] : ''}
								onChange={(value) => {
									setAttributes({
										maxHeight: [
											value,
											undefined !== maxHeight && undefined !== maxHeight[1] ? maxHeight[1] : '',
											undefined !== maxHeight && undefined !== maxHeight[2] ? maxHeight[2] : '',
										],
									});
								}}
								tabletValue={undefined !== maxHeight && undefined !== maxHeight[1] ? maxHeight[1] : ''}
								onChangeTablet={(value) => {
									setAttributes({
										maxHeight: [
											undefined !== maxHeight && undefined !== maxHeight[0] ? maxHeight[0] : '',
											value,
											undefined !== maxHeight && undefined !== maxHeight[2] ? maxHeight[2] : '',
										],
									});
								}}
								mobileValue={undefined !== maxHeight && undefined !== maxHeight[2] ? maxHeight[2] : ''}
								onChangeMobile={(value) => {
									setAttributes({
										maxHeight: [
											undefined !== maxHeight && undefined !== maxHeight[0] ? maxHeight[0] : '',
											undefined !== maxHeight && undefined !== maxHeight[1] ? maxHeight[1] : '',
											value,
										],
									});
								}}
								min={0}
								max={maxHeightUnit === 'px' ? 2000 : 100}
								step={1}
								unit={maxHeightUnit ? maxHeightUnit : '%'}
								onUnit={(value) => {
									setAttributes({ maxHeightUnit: value });
								}}
								units={['px', '%', 'vw']}
							/>
						</KadencePanelBody>
					</>
				)}

				{activeTab === 'style' && (
					<>
						<KadencePanelBody
							title={__('Borders', 'kadence-blocks')}
							panelName={'table-borders'}
							initialOpen={true}
						>
							<ResponsiveBorderControl
								label={__('Border', 'kadence-blocks')}
								value={borderStyle}
								tabletValue={tabletBorderStyle}
								mobileValue={mobileBorderStyle}
								onChange={(value) => setAttributes({ borderStyle: value })}
								onChangeTablet={(value) => setAttributes({ tabletBorderStyle: value })}
								onChangeMobile={(value) => setAttributes({ mobileBorderStyle: value })}
							/>

							<ToggleControl
								label={__('Only apply to rows', 'kadence-blocks')}
								checked={borderOnRowOnly}
								onChange={(value) => setAttributes({ borderOnRowOnly: value })}
							/>
						</KadencePanelBody>
						<KadencePanelBody
							title={__('Cell Typography', 'kadence-blocks')}
							panelName={'table-cell-typography'}
							initialOpen={true}
						>
							<TypographyControls
								fontGroup={'heading'}
								fontSize={dataTypography[0].size}
								onFontSize={(value) => saveDataTypography({ size: value })}
								fontSizeType={dataTypography[0].sizeType}
								onFontSizeType={(value) => saveDataTypography({ sizeType: value })}
								lineHeight={dataTypography[0].lineHeight}
								onLineHeight={(value) => saveDataTypography({ lineHeight: value })}
								lineHeightType={dataTypography[0].lineType}
								onLineHeightType={(value) => saveDataTypography({ lineType: value })}
								letterSpacing={dataTypography[0].letterSpacing}
								onLetterSpacing={(value) => saveDataTypography({ letterSpacing: value })}
								textTransform={dataTypography[0].textTransform}
								onTextTransform={(value) => saveDataTypography({ textTransform: value })}
								fontFamily={dataTypography[0].family}
								onFontFamily={(value) => saveDataTypography({ family: value })}
								onFontChange={(select) => {
									saveDataTypography({
										family: select.value,
										google: select.google,
									});
								}}
								onFontArrayChange={(values) => saveDataTypography(values)}
								googleFont={dataTypography[0].google}
								onGoogleFont={(value) => saveDataTypography({ google: value })}
								loadGoogleFont={dataTypography[0].loadGoogle}
								onLoadGoogleFont={(value) => saveDataTypography({ loadGoogle: value })}
								fontVariant={dataTypography[0].variant}
								onFontVariant={(value) => saveDataTypography({ variant: value })}
								fontWeight={dataTypography[0].weight}
								onFontWeight={(value) => saveDataTypography({ weight: value })}
								fontStyle={dataTypography[0].style}
								onFontStyle={(value) => saveDataTypography({ style: value })}
								fontSubset={dataTypography[0].subset}
								onFontSubset={(value) => saveDataTypography({ subset: value })}
							/>
						</KadencePanelBody>
						<KadencePanelBody
							title={__('Header Typography', 'kadence-blocks')}
							panelName={'table-header-typography'}
							initialOpen={false}
						>
							<TypographyControls
								fontGroup={'heading'}
								fontSize={headerTypography[0].size}
								onFontSize={(value) => saveHeaderTypography({ size: value })}
								fontSizeType={headerTypography[0].sizeType}
								onFontSizeType={(value) => saveHeaderTypography({ sizeType: value })}
								lineHeight={headerTypography[0].lineHeight}
								onLineHeight={(value) => saveHeaderTypography({ lineHeight: value })}
								lineHeightType={headerTypography[0].lineType}
								onLineHeightType={(value) => saveHeaderTypography({ lineType: value })}
								letterSpacing={headerTypography[0].letterSpacing}
								onLetterSpacing={(value) => saveHeaderTypography({ letterSpacing: value })}
								textTransform={headerTypography[0].textTransform}
								onTextTransform={(value) => saveHeaderTypography({ textTransform: value })}
								fontFamily={headerTypography[0].family}
								onFontFamily={(value) => saveHeaderTypography({ family: value })}
								onFontChange={(select) => {
									saveHeaderTypography({
										family: select.value,
										google: select.google,
									});
								}}
								onFontArrayChange={(values) => saveHeaderTypography(values)}
								googleFont={headerTypography[0].google}
								onGoogleFont={(value) => saveHeaderTypography({ google: value })}
								loadGoogleFont={headerTypography[0].loadGoogle}
								onLoadGoogleFont={(value) => saveHeaderTypography({ loadGoogle: value })}
								fontVariant={headerTypography[0].variant}
								onFontVariant={(value) => saveHeaderTypography({ variant: value })}
								fontWeight={headerTypography[0].weight}
								onFontWeight={(value) => saveHeaderTypography({ weight: value })}
								fontStyle={headerTypography[0].style}
								onFontStyle={(value) => saveHeaderTypography({ style: value })}
								fontSubset={headerTypography[0].subset}
								onFontSubset={(value) => saveHeaderTypography({ subset: value })}
							/>
						</KadencePanelBody>
						<KadencePanelBody
							title={__('Row Backgrounds', 'kadence-blocks')}
							panelName={'table-row-background'}
							initialOpen={false}
						>
							<ToggleControl
								label={__('Even/Odd Backgrounds', 'kadence-blocks')}
								checked={evenOddBackground}
								onChange={(value) => setAttributes({ evenOddBackground: value })}
							/>

							<HoverToggleControl
								hover={
									<>
										<PopColorControl
											label={__('Hover Background Color', 'kadence-blocks')}
											value={backgroundHoverColorEven ? backgroundHoverColorEven : ''}
											default={''}
											onChange={(value) => setAttributes({ backgroundHoverColorEven: value })}
										/>

										{evenOddBackground && (
											<PopColorControl
												label={__('Hover Odd Background Color', 'kadence-blocks')}
												value={backgroundHoverColorOdd ? backgroundHoverColorOdd : ''}
												default={''}
												onChange={(value) => setAttributes({ backgroundHoverColorOdd: value })}
											/>
										)}
									</>
								}
								normal={
									<>
										<PopColorControl
											label={__('Background Color', 'kadence-blocks')}
											value={backgroundColorEven ? backgroundColorEven : ''}
											default={''}
											onChange={(value) => setAttributes({ backgroundColorEven: value })}
										/>

										{evenOddBackground && (
											<PopColorControl
												label={__('Odd Background Color', 'kadence-blocks')}
												value={backgroundColorOdd ? backgroundColorOdd : ''}
												default={''}
												onChange={(value) => setAttributes({ backgroundColorOdd: value })}
											/>
										)}
									</>
								}
							/>
						</KadencePanelBody>

						<KadencePanelBody
							title={__('Column Backgrounds', 'kadence-blocks')}
							panelName={'column-bgs'}
							initialOpen={false}
						>
							{Array.from({ length: columns }).map((_, index) => (
								<KadencePanelBody
									key={index}
									title={__(`Column ${index + 1} Background`, 'kadence-blocks')}
									panelName={'column-bg-' + index}
									initialOpen={false}
								>
									<HoverToggleControl
										hover={
											<PopColorControl
												key={index + 'hover'}
												label={__('Hover Background Color', 'kadence-blocks')}
												value={getColumnBackground(index, true)}
												default={''}
												onChange={(value) => updateColumnBackground(index, value, true)}
											/>
										}
										normal={
											<PopColorControl
												key={index + 'normal'}
												label={__('Background Color', 'kadence-blocks')}
												value={getColumnBackground(index)}
												default={''}
												onChange={(value) => updateColumnBackground(index, value)}
											/>
										}
									/>
								</KadencePanelBody>
							))}
						</KadencePanelBody>
					</>
				)}

				{activeTab === 'advanced' && (
					<>
						<KadenceBlockDefaults
							attributes={attributes}
							defaultAttributes={metadata.attributes}
							blockSlug={metadata.name}
							excludedAttrs={nonTransAttrs}
						/>
					</>
				)}
			</KadenceInspectorControls>
			<BackendStyles attributes={attributes} previewDevice={previewDevice} />
			<table {...innerBlocksProps} />
		</div>
	);
}

export default Edit;
