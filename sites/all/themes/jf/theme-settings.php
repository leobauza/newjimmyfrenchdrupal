<?php
/**
 * Implements hook_form_FORM_ID_alter().
 *
 * @param $form
 *   The form.
 * @param $form_state
 *   The form state.
 */
function jf_form_system_theme_settings_alter(&$form, &$form_state) {


  //social footer links
  $form['jf_settings'] = array(
    '#type' => 'fieldset',
    '#title' => t('Site Information'),
    '#description'   => t("Information for the footer."),
    '#collapsible' => TRUE,
    '#collapsed' => FALSE
  );

  $form['jf_settings']['dribbble'] = array(
    '#type' => 'textfield',
    '#title' => t('Dribbble URL'),
    '#default_value' => theme_get_setting('dribbble'),
    '#description'   => t("Dribbble URL for footer and information page.")
  );

  $form['jf_settings']['twitter'] = array(
    '#type' => 'textfield',
    '#title' => t('Twitter URL'),
    '#default_value' => theme_get_setting('twitter'),
    '#description'   => t("Twitter URL for footer and information page.")
  );

  $form['jf_settings']['instagram'] = array(
    '#type' => 'textfield',
    '#title' => t('Instagram URL'),
    '#default_value' => theme_get_setting('instagram'),
    '#description'   => t("Instagram URL for footer and information page.")
  );

  $form['jf_settings']['linkedin'] = array(
    '#type' => 'textfield',
    '#title' => t('LinkedIn URL'),
    '#default_value' => theme_get_setting('linkedin'),
    '#description'   => t("LinkedIn URL for information page.")
  );

}