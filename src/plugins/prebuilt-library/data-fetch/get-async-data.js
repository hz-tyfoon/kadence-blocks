/**
 * WordPress dependencies
 */
import { useState } from '@wordpress/element';
import apiFetch from '@wordpress/api-fetch';
import { addQueryArgs } from '@wordpress/url';
import { __ } from '@wordpress/i18n';
import { SafeParseJSON } from '@kadence/helpers';
const API_ROUTE_GET_IMAGES = '/kb-design-library/v1/get_images';

export function getAsyncData() {
	const [ isLoadingWizard, setLoadingWizard ] = useState(false);
	const [ isLoadingImages, setLoadingImages ] = useState(false);
	const [ isLoadingAI, setLoadingAI ] = useState(false);
	const [ error, setError ] = useState(false);

	let data_key     = ( kadence_blocks_params.proData &&  kadence_blocks_params.proData.api_key ?  kadence_blocks_params.proData.api_key : '' );
	let data_email   = ( kadence_blocks_params.proData &&  kadence_blocks_params.proData.api_email ?  kadence_blocks_params.proData.api_email : '' );
	const product_id = ( kadence_blocks_params.proData &&  kadence_blocks_params.proData.product_id ?  kadence_blocks_params.proData.product_id : '' );
	if ( ! data_key ) {
		data_key = (  kadence_blocks_params.proData &&  kadence_blocks_params.proData.ithemes_key ?  kadence_blocks_params.proData.ithemes_key : '' );
		if ( data_key ) {
			data_email = 'iThemes';
		}
	}

	/**
	 * Save wizard data to Wordpress options table.
	 *
	 * @return {Promise<boolean>}
	 */
	async function saveAIWizardData(data) {
		setLoadingWizard(true);
		setError(false);

		try {
			const response = await apiFetch({
				path: '/wp/v2/settings',
				method: 'POST',
				data: { kadence_blocks_prophecy: JSON.stringify(data) }
			});

			if (response) {
				setLoadingWizard(false);

				return true;
			}
		} catch (error) {
			console.log(`ERROR: ${ error }`);
			setLoadingWizard(false);
			setError(true);

			return false;
		}
	}

	/**
	 * Get wizard data from database.
	 *
	 * @return {Promise<object>}
	 */
	async function getAIWizardData() {
		setLoadingWizard(true);
		setError(false);

		try {
			const response = await apiFetch({
				path: '/wp/v2/settings',
				method: 'GET',
			});

			if (response) {
				setLoadingWizard(false);

				if (response?.kadence_blocks_prophecy) {
					return response.kadence_blocks_prophecy;
				}
			}
		} catch (error) {
			console.log(`ERROR: ${ error }`);
			setLoadingWizard(false);
			setError(true);

			return {};
		}
	}

	/**
	 * Get photo collection by industry
	 *
	 * @param {(object)} userData
	 *
	 * @return {Promise<object>} Promise returns object
	 */
	async function getCollectionByIndustry(userData) {
		if ( ! userData?.photoLibrary ) {
			return [];
		}
		if ( 'My Images' === userData?.photoLibrary ) {
			const myImages = { data: [] };
			if ( userData?.featuredImages ) {
				const aImages = userData?.featuredImages.map( ( item, index ) => {
					return { sizes:[ { src: item.url } ]};
				} );
				myImages.data.push( { images: aImages } );
			}
			if ( userData?.backgroundImages ) {
				const bImages = userData?.backgroundImages.map( ( item, index ) => {
					return { sizes:[ { src: item.url } ]};
				} );
				myImages.data.push( { images: bImages } );
			}
			return myImages;
		}
		const industries = Array.isArray(userData.photoLibrary) ? userData?.photoLibrary : [ userData.photoLibrary ];
		try {
			const response = await apiFetch( {
				path: addQueryArgs( API_ROUTE_GET_IMAGES, {
					industries: industries,
					api_key: data_key,
				} ),
			} );
			const responseData = SafeParseJSON( response, false );
			if ( responseData ) {
				return responseData;
			}
			return [];
		} catch (error) {
			console.log(`ERROR: ${ error }`);
		}
	}

	/**
	 * Get the AI content data from the server.
	 *
	 * @param {(object)} userData
	 *
	 * @return {Promise<object>} Promise returns object
	 */
	async function getAIContentData( context ) {
		try {
			const response = await apiFetch( {
				path: addQueryArgs( '/kb-design-library/v1/get', {
					context: context,
					api_key:data_key,
				} ),
			} );
			return response;
		} catch (error) {
			console.log(`ERROR: ${ error }`);
			return 'failed';
		}
	}
	/**
	 * Force a reload of the AI content data.
	 *
	 * @return {Promise<object>} Promise returns object
	 */
	async function loadVerticals() {
		const response = await apiFetch( {
			path: addQueryArgs( '/kb-design-library/v1/get_verticals', {
				api_key: data_key,
			} ),
		} );
		return response;
	};
	/**
	 * Force a reload of the AI content data.
	 *
	 * @return {Promise<object>} Promise returns object
	 */
	async function loadCollections() {
		const response = await apiFetch( {
			path: addQueryArgs( '/kb-design-library/v1/get_image_collections', {
				api_key: data_key,
			} ),
		} );
		return response;
	}

	/**
	 * Force a reload of the AI content data.
	 *
	 * @param {(object)} context
	 *
	 * @return {Promise<object>} Promise returns object
	 */
	async function getAIContentDataReload( context ) {
		try {
			const response = await apiFetch( {
				path: addQueryArgs( '/kb-design-library/v1/get', {
					force_reload: true,
					context: context,
					api_key:data_key,
				} ),
			} );
			return response;
		} catch (error) {
			console.log(`ERROR: ${ error }`);
			return 'failed';
		}
	}

	/**
	 * Get library data.
	 *
	 * @param {(object)} userData
	 *
	 * @return {Promise<object>} Promise returns object
	 */
	async function getPatterns( library, reload, library_url = null, key = null ) {
		try {
			const response = await apiFetch( {
				path: addQueryArgs( '/kb-design-library/v1/get_library', {
					force_reload: reload,
					library: library,
					library_url: library_url ? library_url : '',
					key: key ? key : library,
					api_key:data_key,
					api_email:data_email,
					product_id:product_id,
				} ),
			} );
			return response;
		} catch (error) {
			console.log(`ERROR: ${ error }`);
			return 'failed';
		}
	}
	/**
	 * Get library data.
	 *
	 * @param {(object)} userData
	 *
	 * @return {Promise<object>} Promise returns object
	 */
	async function getPattern( library, type, item_id, style, library_url = null, key = null ) {
		try {
			const response = await apiFetch( {
				path: addQueryArgs( '/kb-design-library/v1/get_pattern_content', {
					library: library,
					library_url: library_url ? library_url : '',
					key: key ? key : library,
					pattern_id: item_id ? item_id : '',
					pattern_type: type ? type : '',
					pattern_type: style ? style : '',
					api_key: data_key,
					api_email: data_email,
					product_id: product_id,
				} ),
			} );
			return response;
		} catch (error) {
			console.log(`ERROR: ${ error }`);
			return 'failed';
		}
	}
	/**
	 * Get local contexts.
	 *
	 * @param {(object)} userData
	 *
	 * @return {Promise<object>} Promise returns object
	 */
	async function getLocalAIContexts() {
		try {
			const response = await apiFetch( {
				path: '/kb-design-library/v1/get_local_contexts',
			} );
			return response;
		} catch (error) {
			console.log(`ERROR: ${ error }`);
			return 'failed';
		}
	}
	/**
	 * Get library data.
	 *
	 * @param {(object)} userData
	 *
	 * @return {Promise<object>} Promise returns object
	 */
	async function processPattern( content, imageCollection ) {
		try {
			const response = await apiFetch( {
				path: '/kb-design-library/v1/process_pattern',
				method: 'POST',
				data: {
					content: content,
					image_library: imageCollection,
				},
			} );
			return response;
		} catch (error) {
			console.log(`ERROR: ${ error }`);
			return 'failed';
		}
	}

	return {
		error,
		getAIContentData,
		getAIContentDataReload,
		saveAIWizardData,
		getAIWizardData,
		getCollectionByIndustry,
		getPatterns,
		getPattern,
		processPattern,
		getLocalAIContexts,
	}
}
