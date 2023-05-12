<?php

/**
 * Advanced Form Ajax Handing.
 *
 * @package Kadence Blocks
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Main plugin class
 */
class KB_Ajax_Advanced_Form {

	/**
	 * Instance Control
	 *
	 * @var null
	 */
	private static $instance = null;

	private static $redirect = false;

	private static $actions = [];

	private static $fields = [];

	private static $messages = [];

	/**
	 * Instance Control
	 */
	public static function get_instance() {
		if ( is_null( self::$instance ) ) {
			self::$instance = new self();
		}

		return self::$instance;
	}

	/**
	 * Class Constructor.
	 */
	public function __construct() {
		add_action( 'wp_ajax_kb_process_advanced_form_submit', array( $this, 'process_ajax' ) );
		add_action( 'wp_ajax_nopriv_kb_process_advanced_form_submit', array( $this, 'process_ajax' ) );
	}

	/**
	 * Process the form submit.
	 */
	public function process_ajax() {

		if ( isset( $_POST['_kb_form_id'] ) && ! empty( $_POST['_kb_form_id'] ) && isset( $_POST['_kb_form_post_id'] ) && ! empty( $_POST['_kb_form_post_id'] ) ) {
			$this->start_buffer();

			if ( apply_filters( 'kadence_blocks_form_verify_nonce', is_user_logged_in() ) && ! check_ajax_referer( 'kb_form_nonce', '_kb_form_verify', false ) ) {
				$this->process_bail( __( 'Submission rejected, invalid security token. Reload the page and try again.', 'kadence-blocks' ), __( 'Token invalid', 'kadence-blocks' ) );
			}
			$post_id = sanitize_text_field( wp_unslash( $_POST['_kb_form_post_id'] ) );

			$form_args = $this->get_form( $post_id );
			$messages  = $this->get_messages( $form_args['attributes'] );

			// Check Honey Pot.
			if ( isset( $form_args['attributes']['honeyPot'] ) && true === $form_args['attributes']['honeyPot'] && isset( $_POST['_kb_verify_email'] ) ) {
				$honeypot_check = htmlspecialchars( $_POST['_kb_verify_email'], ENT_QUOTES );
				if ( ! empty( $honeypot_check ) ) {
					$this->process_bail( __( 'Submission Rejected', 'kadence-blocks' ), __( 'Spam Detected', 'kadence-blocks' ) );
				}
				unset( $_POST['_kb_verify_email'] );
			}

			// Check Recaptcha.
			if ( isset( $form_args['attributes']['recaptcha'] ) && true === $form_args['attributes']['recaptcha'] ) {
				if ( isset( $form_args['attributes']['recaptchaVersion'] ) && 'v2' === $form_args['attributes']['recaptchaVersion'] ) {
					if ( ! isset( $_POST['g-recaptcha-response'] ) || empty( $_POST['g-recaptcha-response'] ) ) {
						$this->process_bail( $messages['recaptchaerror'], __( 'reCAPTCHA Failed', 'kadence-blocks' ) );
					}
					if ( ! $this->verify_recaptcha_v2( $_POST['g-recaptcha-response'] ) ) {
						$this->process_bail( $messages['recaptchaerror'], __( 'reCAPTCHA Failed', 'kadence-blocks' ) );
					}
				} else {
					if ( ! $this->verify_recaptcha( $_POST['recaptcha_response'] ) ) {
						$this->process_bail( $messages['recaptchaerror'], __( 'reCAPTCHA Failed', 'kadence-blocks' ) );
					}
				}
				unset( $_POST['recaptcha_response'] );
			}

			$processed_fields = $this->process_fields( $form_args['fields'] );

			do_action( 'kadence_blocks_advanced_form_submission', $form_args, $processed_fields, $post_id );

			$this->after_submit_actions( $form_args, $processed_fields, $post_id );

			$success  = apply_filters( 'kadence_blocks_advanced_form_submission_success', true, $form_args, $processed_fields, $post_id );
			$messages = apply_filters( 'kadence_blocks_advanced_form_submission_messages', $messages, $form_args, $processed_fields, $post_id );

			if ( ! $success ) {
				$this->process_bail( $messages['error'], __( 'Third Party Failed', 'kadence-blocks' ) );
			} else {
				$final_data['html'] = '<div class="kb-adv-form-message kb-adv-form-success">' . $messages['success'] . '</div>';
				$this->send_json( $final_data );
			}

		} else {
			$this->process_bail( __( 'Submission failed', 'kadence-blocks' ), __( 'No Data', 'kadence-blocks' ) );
		}
	}

	/**
	 * Sanitize the field
	 *
	 * @param string $field_type the field type.
	 * @param mixed  $value      the field value.
	 */
	private function sanitize_field( $field_type, $value, $multi_select = false ) {
		switch ( $field_type ) {
			case 'text':
			case 'tel':
			case 'password':
			case 'hidden':
			case 'search':
			case 'select':
				$value = ( $multi_select && is_array( $value ) ? sanitize_text_field( implode( ', ', $value ) ) : sanitize_text_field( $value ) );
				break;
			case 'checkbox':
				$value = ( is_array( $value ) ? sanitize_text_field( implode( ', ', $value ) ) : sanitize_text_field( $value ) );
				break;
			case 'radio':
				$value = ( is_array( $value ) ? sanitize_text_field( implode( ', ', $value ) ) : sanitize_text_field( $value ) );
				break;
			case 'url':
				$value = esc_url_raw( trim( $value ) );
				break;
			case 'textarea':
				$value = sanitize_textarea_field( $value );
				break;
			case 'email':
				$value = sanitize_email( trim( $value ) );
				break;
			case 'accept':
				$value = esc_html__( 'Accept', 'kadence-blocks' );
				break;
			default:
				/**
				 * Sanitize field value.
				 * Filters the value of the form field for sanitization purpose.
				 * The dynamic portion of the hook name, `$field_type`, refers to the field type.
				 *
				 * @param string $value The field value.
				 */
				$value = apply_filters( "kadence_blocks_form_sanitize_{$field_type}", $value );
		}

		return $value;
	}

	public function after_submit_actions( $form_args, $processed_fields, $post_id ) {

		$success = true;

		$actions = $form_args['attributes']['actions'];

		$submit_actions = new Kadence_Blocks_Advanced_Form_Submit_Actions( $form_args, $processed_fields, $post_id );

		foreach ( $actions as $action ) {
			switch ( $action ) {
				case 'email':
					$submit_actions->email();
					break;
				case 'redirect':
					if ( isset( $form_args['attributes']['redirect'] ) && ! empty( trim( $form_args['attributes']['redirect'] ) ) ) {
						self::$redirect = apply_filters( 'kadence_blocks_advanced_form_redirect', trim( $form_args['attributes']['redirect'] ), $form_args, $processed_fields, $post_id );
					}
					break;
				case 'mailerlite':
					$submit_actions->mailerlite();
					break;
				case 'fluentCRM':
					$submit_actions->fluentCRM();
					break;
				case 'sendinblue':
					$submit_actions->sendinblue();
					break;
				case 'mailchimp':
					$submit_actions->mailchimp();
					break;
				case 'convertkit':
					$submit_actions->convertkit();
					break;
				case 'activecampaign':
					$submit_actions->activecampaign();
					break;
				case 'webhook':
					$submit_actions->webhook();
				case 'entry':
					$submit_actions->entry($post_id);
					break;
				case 'autoEmail':
					$submit_actions->autoEmail();
					break;
			}
		}

		if( self::$redirect ){
			// Return the redirect URL.
		}

		return $success;
	}

	public function process_fields( $fields ) {

		$processed_fields = array();

		foreach ( $fields as $index => $field ) {
			$expected_field = ! empty( $field['name'] ) ? $field['name'] : 'field' . $field['uniqueID'];

			// Fail if required field is missing
			if ( empty( $_POST[ $expected_field ] ) && ! empty( $field['required'] ) && $field['required'] && $field['type'] !== 'file' ) {
				$required_message = ! empty( $field['required_message'] ) ? $field['required_message'] : __( 'Missing a required field', 'kadence-blocks' );

				$this->process_bail( __( 'Submission Failed', 'kadence-blocks' ), $required_message );
			}

			$value = $this->sanitize_field( $field['type'], isset( $_POST[ $expected_field ] ) ? $_POST[ $expected_field ] : '', empty( $field['multiple'] ) ? false : $field['multiple'] );

			// If field is file, verify and process the file
			if ( $field['type'] === 'file' ) {

				// File required & skipped
				if ( empty( $_FILES[ $expected_field ]['size'] ) && ! empty( $field['required'] ) && $field['required'] ) {
					$required_message = ! empty( $field['required_message'] ) ? $field['required_message'] : __( 'Missing a required field', 'kadence-blocks' );

					$this->process_bail( __( 'Submission Failed', 'kadence-blocks' ), $required_message );
				} else if ( empty( $_FILES[ $expected_field ]['size'] ) ){
					continue;
				}

				$max_upload_size_mb    = empty( $field['maxSizeMb'] ) ? 10 : $field['maxSizeMb'];
				$max_upload_size_bytes = $max_upload_size_mb * pow( 1024, 2 );

				// Was file too big
				if ( $_FILES[ $expected_field ]['size'] > $max_upload_size_bytes ) {
					$this->process_bail( __( 'Submission Failed', 'kadence-blocks' ), __( 'File too large', 'kadence-blocks' ) );
				}


				if ( ! is_uploaded_file( $_FILES[ $expected_field ]['tmp_name'] ) ) {
					$this->process_bail( __( 'Submission Failed', 'kadence-blocks' ), __( 'File was not uploaded', 'kadence-blocks' ) );
				}


				$allowed_file_categories = empty( $field['allowedTypes'] ) ? array( 'images' ) : $field['allowedTypes'];
				$allowed_file_types      = $this->get_allowed_mine_types( $allowed_file_categories );

				$mime_type = mime_content_type( $_FILES[ $expected_field ]['tmp_name'] );

				if ( ! in_array( $mime_type, $allowed_file_types ) ) {
					$this->process_bail( __( 'Submission Failed', 'kadence-blocks' ), __( 'File type not allowed', 'kadence-blocks' ) );
				}

				require_once( ABSPATH . 'wp-includes/ms-functions.php' );
				require_once( ABSPATH . 'wp-admin/includes/ms.php' );

				// Check if space is an issue
				$space     = get_upload_space_available();
				$file_size = filesize( $_FILES[ $expected_field ]['tmp_name'] );
				if ( $space < $file_size || upload_is_user_over_quota( false ) ) {
					$this->process_bail( __( 'Submission Failed', 'kadence-blocks' ), __( 'Not enough disk space on the server.', 'kadence-blocks' ) );
				}

				$subfolder     = '/kadence_form/' . date( 'Y' ) . '/' . date( 'm' ) . '/';
				$destination   = wp_upload_dir()['basedir'] . $subfolder;

				$upload_filename = wp_unique_filename( $destination, time() . '_' . $_FILES[ $expected_field ]['name'] );
				$abs_file_path = $destination . $upload_filename;
				$rel_file_path = '/uploads' . $subfolder . $upload_filename;

				// Create folder if not exist
				if ( ! is_dir( $destination ) ) {
					wp_mkdir_p( $destination );
				}

				if ( move_uploaded_file( $_FILES[ $expected_field ]['tmp_name'], $abs_file_path ) ) {
					$this->set_permissions( $abs_file_path );

					$value = content_url( $rel_file_path );
				} else {
					$this->process_bail( __( 'Submission Failed', 'kadence-blocks' ), __( 'Failed to upload file', 'kadence-blocks' ) );
				}
			}


			$processed_fields[] = array(
				'label'    => $field['label'],
				'type'     => $field['type'],
				'required' => empty( $field['required'] ) ? false : $field['required'],
				'value'    => $value,
			);
		}

		return $processed_fields;

	}

	/**
	 * Bail out something isn't correct.
	 *
	 * @param string $error  Error to display.
	 * @param string $note   Note to show in console.
	 * @param string $action action to take if any.
	 */
	public function process_bail( $error, $note, $required = null ) {
		$notices                  = array();
		$notices['error']['note'] = $error;
		$out                      = array(
			'html'     => $this->html_from_notices( $notices ),
			'console'  => $note,
			'required' => $required,
		);
		$this->send_json( $out, true );
	}

	/**
	 * Check Recaptcha
	 *
	 * @param string $token Recaptcha token.
	 *
	 * @return bool
	 */
	private function verify_recaptcha( $token ) {
		$recaptcha_url = 'https://www.google.com/recaptcha/api/siteverify';
		$secret        = get_option( 'kadence_blocks_recaptcha_secret_key' );
		if ( ! $secret ) {
			return false;
		}
		$args           = array(
			'body' => array(
				'secret'   => $secret,
				'response' => $token,
			),
		);
		$verify_request = wp_remote_post( $recaptcha_url, $args );
		if ( is_wp_error( $verify_request ) ) {
			return false;
		}
		$response = wp_remote_retrieve_body( $verify_request );
		if ( is_wp_error( $response ) ) {
			return false;
		}
		$response = json_decode( $response, true );

		if ( ! isset( $response['success'] ) ) {
			return false;
		}

		return $response['success'];

	}

	/**
	 * Check Recaptcha V2
	 *
	 * @param string $token Recaptcha token.
	 *
	 * @return bool
	 */
	private function verify_recaptcha_v2( $token ) {

		$recaptcha_url = 'https://www.google.com/recaptcha/api/siteverify';
		$secret        = get_option( 'kadence_blocks_recaptcha_secret_key' );
		if ( ! $secret ) {
			return false;
		}
		$args           = array(
			'body' => array(
				'secret'   => $secret,
				'response' => $token,
				'remoteip' => $_SERVER['REMOTE_ADDR'],
			),
		);
		$verify_request = wp_remote_post( $recaptcha_url, $args );
		if ( is_wp_error( $verify_request ) ) {
			return false;
		}
		$response = wp_remote_retrieve_body( $verify_request );
		if ( is_wp_error( $response ) ) {
			return false;
		}
		$response = json_decode( $response, true );

		if ( ! isset( $response['success'] ) ) {
			return false;
		}
		if ( isset( $response['success'] ) && true === $response['success'] ) {
			return $response['success'];
		}
		if ( isset( $response['error-codes'] ) && is_array( $response['error-codes'] ) ) {
			if ( isset( $response['error-codes'][0] ) && $response['error-codes'][0] === 'timeout-or-duplicate' ) {
				return true;
			}
		}

		return false;
	}

	/**
	 * Create HTML string from notices
	 *
	 * @param array $notices Notices to display.
	 *
	 * @return string
	 */
	public function html_from_notices( $notices = array() ) {
		$html = '';
		foreach ( $notices as $note_type => $notice ) {
			if ( ! empty( $notice['note'] ) ) {
				$html .= '<div class="kb-adv-form-message kb-adv-form-warning">' . $notice['note'] . '</div>';
			}
		}

		return $html;
	}

	/**
	 * Starts a flushable buffer
	 */
	public function start_buffer() {
		if ( ! did_action( 'kadence_blocks_forms_buffer_started' ) ) {

			ob_start();

			/**
			 * Runs when buffer is started
			 *
			 * Used to prevent starting buffer twice
			 */
			do_action( 'kadence_blocks_forms_buffer_started' );
		}
	}

	/**
	 * Wrapper for wp_send_json() with output buffering
	 *
	 * @since 1.8.0
	 *
	 * @param array $data     Data to return
	 * @param bool  $is_error Optional. Is this an error. Default false.
	 */
	public function send_json( $data = array(), $is_error = false ) {
		$buffer = ob_get_clean();
		/**
		 * Runs before Kadence Blocks Forms returns json via wp_send_json() exposes output buffer
		 *
		 * @param string|null $buffer   Buffer contents
		 * @param bool        $is_error If we think this is an error response or not.
		 */
		do_action( 'kadence_blocks_forms_buffer_flushed', $buffer, $is_error );
		$data['headers_sent'] = headers_sent();
		if ( ! $is_error ) {
			//status_header( 200 );
			$data['success']      = true;
			$data['show_message'] = true;
			wp_send_json( $data );
		} else {
			wp_send_json_error( $data );
		}
	}

	public function get_allowed_mine_types( $categories ) {
		$allowed_mime_types = array();

		$mimtypes = array(
			'images'     => array(
				'image/gif',
				'image/jpeg',
				'image/png',
			),
			'pdf'       => array(
				'application/pdf',
			),
			'video'     => array(
				'video/mp4',
				'video/mpg',
				'video/mpeg',
				'video/quicktime',
				'video/x-ms-wmv'
			),
			'audio'     => array(
				'audio/mpeg',
				'audio/mp3',
				'audio/wav',
				'audio/x-wav',
				'audio/x-m4a',
				'audio/aac',
				'audio/mp4',
				'audio/x-ms-wma',
				'audio/webm',
				'audio/ogg',
			),
			'documents' => array(
				'text/plain',
				'text/csv',
				'application/msword',
				'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
				'application/vnd.ms-excel',
				'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
				'application/vnd.ms-powerpoint',
				'application/vnd.openxmlformats-officedocument.presentationml.presentation',
			)
		);

		foreach ( $categories as $category ) {
			$allowed_mime_types = array_merge( $allowed_mime_types, $mimtypes[ $category ] );
		}

		return $allowed_mime_types;
	}

	private function set_permissions( $file ) {
		$permission = apply_filters( 'kadence_form_upload_permissions', 0644, $file );

		if ( $permission ) {
			@chmod( $file, $permission );
		}
	}

	/**
	 * Get form details
	 *
	 * @param integer $post_id the form post id.
	 * @param string  $form_id the form id.
	 */
	private function get_form( $post_id ) {
		$form_args = [];
		$blocks    = '';

		$post_data = get_post( absint( $post_id ) );
		if ( is_object( $post_data ) ) {
			$blocks = parse_blocks( $post_data->post_content );
		}

		// No form field inner blocks found.
		if ( ! is_array( $blocks ) || empty( $blocks ) || ! isset( $blocks[0]['blockName'] ) || $blocks[0]['blockName'] !== 'kadence/advanced-form' || empty( $blocks[0]['innerBlocks'] ) ) {
			$this->process_bail( __( 'Submission Failed', 'kadence-blocks' ), __( 'Data not found', 'kadence-blocks' ) );
		}

		$post_meta = get_post_meta( $post_id );
		$meta_args = array();

		foreach ( $post_meta as $meta_key => $meta_value ) {
			if ( strpos( $meta_key, '_kad_form_' ) === 0 && isset($meta_value[0]) ){
				$meta_args[ str_replace( '_kad_form_', '', $meta_key ) ] = maybe_unserialize( $meta_value[0] );
			}
		}

		$form_args['attributes'] = json_decode( json_encode( $meta_args ), true );
		foreach ( $blocks[0]['innerBlocks'] as $block ) {
			$this->recursively_parse_blocks( $block );
		}
		$form_args['fields'] = self::$fields;

		return $form_args;
	}
	/**
	 * Gets all the field blocks that are in post.
	 *
	 * @access private
	 *
	 * @param string $block The page content content.
	 */
	private function recursively_parse_blocks( $block ) {
		if ( ! is_object( $block ) && is_array( $block ) && isset( $block['blockName'] ) ) {
			if ( isset( $block['innerBlocks'] ) && ! empty( $block['innerBlocks'] ) && is_array( $block['innerBlocks'] ) ) {
				foreach ( $block['innerBlocks'] as $inner_block ) {
					$this->recursively_parse_blocks( $inner_block );
				}
			} else {
				if ( 'kadence/advanced-form-submit' !== $block['blockName'] && strpos( $block['blockName'], 'kadence/advanced-form-' ) === 0 ) {
					self::$fields[] = array_merge(
						$block['attrs'],
						array( 'type' => str_replace( 'kadence/advanced-form-', '', $block['blockName'] ) )
					);
				}
			}
		}
	}
	private function get_messages( $form_attributes ) {
		$messages = array(
			'success'        => esc_html__( 'Submission Success, Thanks for getting in touch!', 'kadence-blocks' ),
			'error'          => esc_html__( 'Submission Failed', 'kadence-blocks' ),
			'recaptchaerror' => esc_html__( 'Submission Failed, reCaptcha spam prevention. Please reload your page and try again.', 'kadence-blocks' ),
		);

		if ( empty( $form_attributes['messages'] ) || ! is_array( $form_attributes['messages'] ) ) {
			return $messages;
		}

		foreach ( $form_attributes['messages'] as $key => $message ) {
			if ( ! empty( $message ) ) {
				$messages[ $key ] = $message;
			}
		}

		return $messages;
	}

}

KB_Ajax_Advanced_Form::get_instance();