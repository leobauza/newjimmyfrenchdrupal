<?php
/**
 * @file
 * Project Pages
 */

?>

<?php require_once __DIR__ . "/../partials/header.tpl.inc"; ?>

<?php print $messages; ?>

<section class="main-content">
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

  <header class="content__header">
    <?php print render($title_prefix); ?>
      <h2><?php print $title; ?></h2>
    <?php print render($title_suffix); ?>
    <?php if ($fields['field_subtitle']): ?>
      <p><?php print $fields['field_subtitle']['value']; ?></p>
    <?php endif; ?>
      <img src="<?php print $intro_img; ?>" alt="<?php print $title; ?>" />

    <?php
      if (isset($fields['body'])) {
        print $fields['body']['value'];
      }
    ?>
  </header>

  <section class="content__rows" style="background-color: <?php if (isset($fields['field_background_colour']['value'])) print "#" . $fields['field_background_colour']['value']; ?>">
    <?php if ($fields['field_case_study_template']['value'] === 'full' ) : ?>
      <?php require_once __DIR__ . "/../partials/rows.tpl.inc"; ?>
    <?php else : ?>
      <?php require_once __DIR__ . "/../partials/rows--basic.tpl.inc"; ?>
    <?php endif; ?>
  </section>



</section>


<footer class="footer container">
  <?php
    //print theme_get_setting('company_phone');
  ?>
  <p>&copy; Copyright <?php print date("Y"); ?></p>
  <?php print render($page['footer']); ?>
</footer>
