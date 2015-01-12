<?php
/**
 * @file
 * Project Pages
 */
?>

<header>
  <div>Grid Nav</div>
  <?php if (!empty($site_name)): ?>
    <h1 id="brand">
      <a href="<?php print $front_page; ?>" title="<?php print t('Home'); ?>"><?php print $site_name; ?></a>
    </h1>
  <?php endif; ?>
  <div>infolink</div>
</header>

<?php print $messages; ?>

<section class="main-content">
  <?php if (!empty($page['highlighted'])): ?>
    <div class="highlighted hero-unit"><?php print render($page['highlighted']); ?></div>
  <?php endif; ?>

  <?php if (!empty($tabs)): ?>
    <?php print render($tabs); ?>
  <?php endif; ?>

  <!-- DISPLAYS MESSAGES AND STUFF -->
  <?php if (!empty($page['help'])): ?>
    <div class="well"><?php print render($page['help']); ?></div>
  <?php endif; ?>

  <?php if (!empty($action_links)): ?>
    <ul class="action-links"><?php print render($action_links); ?></ul>
  <?php endif; ?>
  <?php //print render($page['content']); ?>

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

  <?php if ($fields['field_case_study_template']['value'] === 'full' ) : ?>
    <?php require_once __DIR__ . "/../partials/rows.tpl.inc"; ?>
  <?php else : ?>
    <?php require_once __DIR__ . "/../partials/rows--basic.tpl.inc"; ?>
  <?php endif; ?>



</section>


<footer class="footer container">
  <?php
    //print theme_get_setting('company_phone');
  ?>
  <p>&copy; Copyright <?php print date("Y"); ?></p>
  <?php print render($page['footer']); ?>
</footer>
