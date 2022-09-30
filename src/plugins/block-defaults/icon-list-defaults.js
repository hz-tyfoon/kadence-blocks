import {PopColorControl, IconControl, TypographyControls, MeasurementControls} from '@kadence/components';
import {map} from 'lodash';

/**
 * Internal block libraries
 */
import {__} from '@wordpress/i18n';
import {
    Component,
    Fragment,
    useEffect,
    useState
} from '@wordpress/element';
import {
    Button,
    PanelBody,
    RangeControl,
    SelectControl,
    Modal,
    ButtonGroup,
    Tooltip,
} from '@wordpress/components';
import {useDispatch} from '@wordpress/data';
import {store as noticesStore} from '@wordpress/notices';

import {alignBottomIcon, alignMiddleIcon, alignTopIcon, iconListBlockIcon} from '@kadence/icons';
import {linkedOrIndividual} from '@kadence/helpers';

function KadenceIconListDefault(props) {

    const [isOpen, setIsOpen] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [configuration, setConfiguration] = useState((kadence_blocks_params.configuration ? JSON.parse(kadence_blocks_params.configuration) : {}));
    const [marginControl, setMarginControl] = useState('individual');
    const {createErrorNotice} = useDispatch(noticesStore);

    useEffect(() => {
        const iconListConfig = (configuration && configuration['kadence/iconlist'] ? configuration['kadence/iconlist'] : {});
        if (undefined !== iconListConfig.listMargin && undefined !== iconListConfig.listMargin[0]) {
			setMarginControl( linkedOrIndividual( iconListConfig, 'listMargin' ) );
        }
    }, []);

    const saveConfig = (blockID, settingArray) => {
		setIsSaving(true);
        const config = (kadence_blocks_params.configuration ? JSON.parse(kadence_blocks_params.configuration) : {});
        if (!config[blockID]) {
            config[blockID] = {};
        }
        config[blockID] = settingArray;
        const settingModel = new wp.api.models.Settings({kadence_blocks_config_blocks: JSON.stringify(config)});
        settingModel.save().then(response => {
            createErrorNotice(__('Block defaults saved!', 'kadence-blocks'), {
                type: 'snackbar',
            });

			setIsSaving(false);
			setConfiguration({ ...config });
			setIsOpen(false);

            kadence_blocks_params.configuration = JSON.stringify(config);
        });
    }

    const saveConfigState = (key, value) => {
        const config = configuration;
        if (config['kadence/iconlist'] === undefined || config['kadence/iconlist'].length == 0) {
            config['kadence/iconlist'] = {};
        }
        config['kadence/iconlist'][key] = value;
		setConfiguration({ ...config });
    }


    const iconListConfig = (configuration && configuration['kadence/iconlist'] ? configuration['kadence/iconlist'] : {});
    const itemDefaults = [{
        icon: 'fe_checkCircle',
        link: '',
        target: '_self',
        size: 20,
        width: 2,
        text: '',
        color: '',
        background: '',
        border: '',
        borderRadius: 0,
        padding: 5,
        borderWidth: 1,
        style: 'default',
        level: 0
    }];
    const iconAlignOptions = [
        {key: 'top', name: __('Top'), icon: alignTopIcon},
        {key: 'middle', name: __('Middle'), icon: alignMiddleIcon},
        {key: 'bottom', name: __('Bottom'), icon: alignBottomIcon},
    ];
    const items = (undefined !== iconListConfig.items && iconListConfig.items[0] ? iconListConfig.items : itemDefaults);
    const saveListItem = (value) => {
        const newUpdate = items.map((item, index) => {
            if (0 === index) {
                item = {...item, ...value};
            }
            return item;
        });
        saveConfigState('items', newUpdate);
        
    };
    const listDefaultStyles = [{
        size: ['', '', ''],
        sizeType: 'px',
        lineHeight: ['', '', ''],
        lineType: 'px',
        letterSpacing: '',
        family: '',
        google: false,
        style: '',
        weight: '',
        variant: '',
        subset: '',
        loadGoogle: true,
        color: '',
        textTransform: '',
    }];
    const listStyles = (undefined !== iconListConfig.listStyles && iconListConfig.listStyles[0] ? iconListConfig.listStyles : listDefaultStyles);
    const saveListStyles = (value) => {
        const newUpdate = listStyles.map((item, index) => {
            if (0 === index) {
                item = {...item, ...value};
            }
            return item;
        });
        saveConfigState('listStyles', newUpdate);
    };
    return (
        <Fragment>
            <Button className="kt-block-defaults" onClick={() => setIsOpen(true) }>
                <span className="kt-block-icon">{iconListBlockIcon}</span>
                {__('Icon List')}
            </Button>
            {isOpen ?
                <Modal
                    className="kt-block-defaults-modal"
                    title={__('Kadence Icon List')}
                    onRequestClose={() => {
                        saveConfig('kadence/iconlist', iconListConfig);
                    }}>
                    <PanelBody
                        title={__('List Controls')}
                        initialOpen={true}
                    >
                        <RangeControl
                            label={__('List Columns')}
                            value={(undefined !== iconListConfig.columns ? iconListConfig.columns : 1)}
                            onChange={value => saveConfigState('columns', value)}
                            min={1}
                            max={3}
                        />
                        <RangeControl
                            label={__('List Vertical Spacing')}
                            value={(undefined !== iconListConfig.listGap ? iconListConfig.listGap : 5)}
                            onChange={value => saveConfigState('listGap', value)}
                            min={0}
                            max={60}
                        />
                        <RangeControl
                            label={__('List Horizontal Icon and Label Spacing')}
                            value={(undefined !== iconListConfig.listLabelGap ? iconListConfig.listLabelGap : 10)}
                            onChange={value => saveConfigState('listLabelGap', value)}
                            min={0}
                            max={60}
                        />
                        <div className="kt-btn-size-settings-container">
                            <h2 className="kt-beside-btn-group">{__('Icon Align')}</h2>
                            <ButtonGroup className="kt-button-size-type-options" aria-label={__('Icon Align')}>
                                {map(iconAlignOptions, ({name, icon, key}) => (
                                    <Tooltip text={name}>
                                        <Button
                                            key={key}
                                            className="kt-btn-size-btn"
                                            isSmall
                                            isPrimary={(undefined !== iconListConfig.iconAlign ? iconListConfig.iconAlign : 'middle') === key}
                                            aria-pressed={(undefined !== iconListConfig.iconAlign ? iconListConfig.iconAlign : 'middle') === key}
                                            onClick={() => saveConfigState('iconAlign', key)}
                                        >
                                            {icon}
                                        </Button>
                                    </Tooltip>
                                ))}
                            </ButtonGroup>
                        </div>
                        <MeasurementControls
                            label={__('List Margin')}
                            measurement={(undefined !== iconListConfig.listMargin ? iconListConfig.listMargin : [0, 0, 10, 0])}
                            control={marginControl}
                            onChange={(value) => saveConfigState('listMargin', value)}
                            onControl={(value) => setMarginControl(value)}
                            min={-200}
                            max={200}
                            step={1}
                        />
                    </PanelBody>
                    <PanelBody
                        title={__('List Text Styling')}
                        initialOpen={false}
                    >
                        <PopColorControl
                            label={__('Color Settings')}
                            value={(listStyles[0].color ? listStyles[0].color : '')}
                            default={''}
                            onChange={value => saveListStyles({color: value})}
                        />
                        <TypographyControls
                            fontSize={listStyles[0].size}
                            onFontSize={(value) => saveListStyles({size: value})}
                            fontSizeType={listStyles[0].sizeType}
                            onFontSizeType={(value) => saveListStyles({sizeType: value})}
                            lineHeight={listStyles[0].lineHeight}
                            onLineHeight={(value) => saveListStyles({lineHeight: value})}
                            lineHeightType={listStyles[0].lineType}
                            onLineHeightType={(value) => saveListStyles({lineType: value})}
                            letterSpacing={listStyles[0].letterSpacing}
                            onLetterSpacing={(value) => saveListStyles({letterSpacing: value})}
                            fontFamily={listStyles[0].family}
                            onFontFamily={(value) => saveListStyles({family: value})}
                            onFontChange={(select) => {
                                saveListStyles({
                                    family: select.value,
                                    google: select.google,
                                });
                            }}
                            onFontArrayChange={(values) => saveListStyles(values)}
                            googleFont={listStyles[0].google}
                            onGoogleFont={(value) => saveListStyles({google: value})}
                            loadGoogleFont={listStyles[0].loadGoogle}
                            onLoadGoogleFont={(value) => saveListStyles({loadGoogle: value})}
                            fontVariant={listStyles[0].variant}
                            onFontVariant={(value) => saveListStyles({variant: value})}
                            fontWeight={listStyles[0].weight}
                            onFontWeight={(value) => saveListStyles({weight: value})}
                            fontStyle={listStyles[0].style}
                            onFontStyle={(value) => saveListStyles({style: value})}
                            fontSubset={listStyles[0].subset}
                            onFontSubset={(value) => saveListStyles({subset: value})}
                            textTransform={listStyles[0].textTransform}
                            onTextTransform={(value) => saveListStyles({textTransform: value})}
                        />
                    </PanelBody>
                    <PanelBody
                        title={__('List Icon Styles')}
                        initialOpen={false}
                    >
                        <IconControl
                            value={items[0].icon}
                            onChange={value => {
                                saveListItem({icon: value});
                            }}
                        />
                        <RangeControl
                            label={__('Icon Size')}
                            value={items[0].size}
                            onChange={value => {
                                saveListItem({size: value});
                            }}
                            min={5}
                            max={250}
                        />
                        {items[0].icon && 'fe' === items[0].icon.substring(0, 2) && (
                            <RangeControl
                                label={__('Line Width')}
                                value={items[0].width}
                                onChange={value => {
                                    saveListItem({width: value});
                                }}
                                step={0.5}
                                min={0.5}
                                max={4}
                            />
                        )}
                        <PopColorControl
                            label={__('Icon Color')}
                            value={(items[0].color ? items[0].color : '')}
                            default={''}
                            onChange={value => {
                                saveListItem({color: value});
                            }}
                        />
                        <SelectControl
                            label={__('Icon Style')}
                            value={items[0].style}
                            options={[
                                {value: 'default', label: __('Default')},
                                {value: 'stacked', label: __('Stacked')},
                            ]}
                            onChange={value => {
                                saveListItem({style: value});
                            }}
                        />
                        {items[0].style !== 'default' && (
                            <PopColorControl
                                label={__('Icon Background')}
                                value={(items[0].background ? items[0].background : '')}
                                default={''}
                                onChange={value => {
                                    saveListItem({background: value});
                                }}
                            />
                        )}
                        {items[0].style !== 'default' && (
                            <PopColorControl
                                label={__('Border Color')}
                                value={(items[0].border ? items[0].border : '')}
                                default={''}
                                onChange={value => {
                                    saveListItem({border: value});
                                }}
                            />
                        )}
                        {items[0].style !== 'default' && (
                            <RangeControl
                                label={__('Border Size (px)')}
                                value={items[0].borderWidth}
                                onChange={value => {
                                    saveListItem({borderWidth: value});
                                }}
                                min={0}
                                max={20}
                            />
                        )}
                        {items[0].style !== 'default' && (
                            <RangeControl
                                label={__('Border Radius (%)')}
                                value={items[0].borderRadius}
                                onChange={value => {
                                    saveListItem({borderRadius: value});
                                }}
                                min={0}
                                max={50}
                            />
                        )}
                        {items[0].style !== 'default' && (
                            <RangeControl
                                label={__('Padding (px)')}
                                value={items[0].padding}
                                onChange={value => {
                                    saveListItem({padding: value});
                                }}
                                min={0}
                                max={180}
                            />
                        )}
                    </PanelBody>
                    <Button className="kt-defaults-save" isPrimary onClick={() => {
                        saveConfig('kadence/iconlist', iconListConfig);
                    }}>
                        {__('Save/Close')}
                    </Button>
                </Modal>
                : null}
        </Fragment>
    );
	
}

export default KadenceIconListDefault;
