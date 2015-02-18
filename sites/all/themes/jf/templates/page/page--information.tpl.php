<?php
/**
 * @file
 * page.tpl.php
 */
?>

<?php require_once path_to_theme('jf') . "/templates/partials/header.tpl.inc"; ?>

<section class="main-content">

  <div class="drupal__required">
    <?php if (!empty($page['highlighted'])): ?>
      <div class="highlighted hero-unit"><?php print render($page['highlighted']); ?></div>
    <?php endif; ?>
    <!-- DISPLAYS MESSAGES AND STUFF -->
    <?php if (!empty($page['help'])): ?>
      <div class="well"><?php print render($page['help']); ?></div>
    <?php endif; ?>

    <?php if (!empty($action_links)): ?>
      <ul class="action-links"><?php print render($action_links); ?></ul>
    <?php endif; ?>
    <?php // print render($page['content']); ?>
  </div>

  <section class="site__hero">
    <img class="cancel" src="<?php print $intro_img; ?>" alt="<?php print $title; ?>" />
    <?php if (!empty($tabs)): ?>
      <?php print render($tabs); ?>
    <?php endif; ?>

  </section>

  <?php print $messages; ?>
  <h2>stuff</h2>
  <p>...everything else...</p>


</section>


<?php require_once path_to_theme('jf') . "/templates/partials/footer.tpl.inc"; ?>
