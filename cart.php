<form action="purchase.php" method="post" id="purchaseForm">
    <input type="text" name="name" placeholder="Your name" required>
    <input type="email" name="email" placeholder="Your email" required>
    <input type="text" name="address" placeholder="Shipping address" required>
    
    <!-- total price -->
    <input type="hidden" name="total" value="123.45">

    <!-- cartData as JSON string -->
    <input type="hidden" name="cartData" id="cartDataInput" value='[{"title":"Lipstick","price":"$15","quantity":2},{"title":"Mascara","price":"$20","quantity":1}]'>

    <button type="submit">Purchase</button>
</form>
<form id="purchaseForm" action="purchase.php" method="post">
  <h3>Shipping Info</h3>
  <input type="text" name="name" placeholder="Your Name" required />
  <input type="email" name="email" placeholder="Your Email" required />
  <input type="text" name="address" placeholder="Shipping Address" required />

  <input type="hidden" name="total" id="totalInput" value="0" />
  <input type="hidden" name="cartData" id="cartDataInput" value="" />

  <button type="submit">Purchase</button>
</form>

