<?php
/**
 * @file
 * page.tpl.php
 */
?>

<?php require_once __DIR__ . "/../partials/header.tpl.inc"; ?>

<?php print $messages; ?>

<section class="main-content">
  <?php if (!empty($page['highlighted'])): ?>
    <div class="highlighted hero-unit"><?php print render($page['highlighted']); ?></div>
  <?php endif; ?>

  <section class="site__hero">
    <svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 170 116.3" xml:space="preserve">
      <path
        fill="none"
        stroke="#fff"
        stroke-miterlimit="10"
        d="M10.8,44.2c0.3-0.3,46-12.1,46-12.1l33,3.6l26,15.3l22,14l10.3,13.3 L131.9,95l-52.3-2.3l-20.7-22l-30.3,5.7l22.7-21.7l38,6.3l-9.7-15.3l-46.7,2.7L17.4,67L6.4,50V21l65.5-5.7l55.3,7.7l23.7,24.7 l6.3,43.6l-59.3,13.2h-37L21.5,97l-9-16.7"
        stroke-dasharray="800.00 800.00"
        stroke-dashoffset="0.00"
      />
    </svg>
    <a href="<?php print $intro_url['value']; ?>" class="hero__feature">
      <img src="<?php print $intro_img; ?>" alt="" />
    </a>
    <?php if (!empty($tabs)): ?>
      <?php print render($tabs); ?>
    <?php endif; ?>
  </section>


  <!-- DISPLAYS MESSAGES AND STUFF -->
  <?php if (!empty($page['help'])): ?>
    <div class="well"><?php print render($page['help']); ?></div>
  <?php endif; ?>

  <?php if (!empty($action_links)): ?>
    <ul class="action-links"><?php print render($action_links); ?></ul>
  <?php endif; ?>
  <?php // print render($page['content']); ?>

  <section class="grid">

    <?php foreach ($projects as $key => $project): ?>
      <a href="/<?php print $project['url']; ?>" class="grid__item">
        <img src="<?php print $project['thumbnail']; ?>" alt="<?php print $project['title']; ?>" />
      </a>
    <?php endforeach; ?>

  </section>

</section>


<?php require_once __DIR__ . "/../partials/footer.tpl.inc"; ?>
