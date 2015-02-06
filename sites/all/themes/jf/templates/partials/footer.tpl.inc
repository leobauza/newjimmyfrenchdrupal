<footer class="site__footer container">
  <?php
    //print theme_get_setting('company_phone');
  ?>
  <p class="copy">&copy; <?php print date("Y"); ?></p>


  <nav class="footer__social">
    <ul>
      <li><a target="_blank" class="twitter" href="<?php print theme_get_setting('twitter'); ?>">Twitter</a></li>
      <li><a target="_blank" class="dribbble" href="<?php print theme_get_setting('dribbble'); ?>">Dribbble</a></li>
      <li><a target="_blank" class="instagram" href="<?php print theme_get_setting('instagram'); ?>">Instagram</a></li>
    </ul>
  </nav>


</footer>
