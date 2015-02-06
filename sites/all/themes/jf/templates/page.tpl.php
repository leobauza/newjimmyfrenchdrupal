<?php
/**
 * @file
 * page.tpl.php
 */
?>

<?php require_once __DIR__ . "/partials/header.tpl.inc"; ?>

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
  <?php print render($page['content']); ?>
</section>


<?php require_once __DIR__ . "/partials/footer.tpl.inc"; ?>
