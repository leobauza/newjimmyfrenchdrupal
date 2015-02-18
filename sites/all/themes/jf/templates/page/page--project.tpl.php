<?php
/**
 * @file
 * Project Pages
 */

$content_styles = '';
if (isset($fields['field_background_colour']['value'])) {
  $content_styles = "style='background-color: #" . $fields['field_background_colour']['value'] . "'";
}

$content_class = '-basic';
$img_wrap_class = 'container';
if ($fields['field_case_study_template']['value'] === 'full') {
  $content_class = '-full';
  $img_wrap_class = '';
}

?>

<?php require_once path_to_theme('jf') . "/templates/partials/header.tpl.inc"; ?>

<?php print $messages; ?>

<section class="main-content">

  <div class="drupal__required">
    <?php if (!empty($page['highlighted'])): ?>
      <div class="highlighted hero-unit"><?php print render($page['highlighted']); ?></div>
    <?php endif; ?>

    <?php if (!empty($tabs)): ?>
      <?php print render($tabs); ?>
    <?php endif; ?>

    <?php if (!empty($page['help'])): ?>
      <div class="well"><?php print render($page['help']); ?></div>
    <?php endif; ?>

    <?php if (!empty($action_links)): ?>
      <ul class="action-links"><?php print render($action_links); ?></ul>
    <?php endif; ?>
    <?php //print render($page['content']); ?>
  </div>

  <header <?php print $content_styles; ?> class="content__header <?php print $content_class; ?>">
    <?php print render($title_prefix); ?>
      <h2>
        <?php print $title; ?>
        <?php if ($fields['field_subtitle']): ?>
          <span class="subtitle"><?php print $fields['field_subtitle']['value']; ?></span>
        <?php endif; ?>
      </h2>
    <?php print render($title_suffix); ?>

    <div class="intro__image <?php print $img_wrap_class; ?>">
      <img src="<?php print $intro_img; ?>" alt="<?php print $title; ?>" />
    </div>

    <?php if (isset($fields['body'])): ?>
      <div class="intro__body container">
        <?php print $fields['body']['value']; ?>
      </div>
    <?php endif; ?>

  </header>

  <section <?php print $content_styles; ?> class="content__rows <?php print $content_class; ?>">
    <div class="container">
      <?php if ($fields['field_case_study_template']['value'] === 'full' ) : ?>
        <?php require_once path_to_theme('jf') . "/templates/partials/rows.tpl.inc"; ?>
      <?php else : ?>
        <?php require_once path_to_theme('jf') . "/templates/partials/rows--basic.tpl.inc"; ?>
      <?php endif; ?>
    </div>
  </section>



</section>


<?php require_once path_to_theme('jf') . "/templates/partials/footer.tpl.inc"; ?>
