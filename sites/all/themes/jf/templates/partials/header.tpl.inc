<header class="site__header">
  <!-- <a href="#" class="nav__toggle">Open</a> -->
  <a href="#" class="icon--grid nav__toggle">
    <span class="square -a"></span>
    <span class="square -b"></span>
    <span class="square -c"></span>
    <span class="square -d"></span>
    <span class="square -e"></span>
    <span class="square -f"></span>
    <span class="square -g"></span>
    <span class="square -h"></span>
    <span class="square -i"></span>
  </a>
  <?php if (!empty($site_name)): ?>
    <h1 id="brand">
      <a href="<?php print $front_page; ?>" title="<?php print t('Home'); ?>">Billy French</a>
    </h1>
  <?php endif; ?>
  <a href="/about" class="info__toggle">information</a>
</header>