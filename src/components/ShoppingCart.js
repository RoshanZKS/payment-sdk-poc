import React from "react";
import "./ShoppingCart.css";

export default function ShoppingCart({
  products,
  cart,
  currency = "USD",
  onIncrement,
  onDecrement,
  onContinue,
  totalAmount,
  continueDisabled,
}) {
  const formatCurrency = (valueInCents) => {
    try {
      return new Intl.NumberFormat(undefined, {
        style: "currency",
        currency,
      }).format(valueInCents / 100);
    } catch {
      return `${currency} ${(valueInCents / 100).toFixed(2)}`;
    }
  };

  return (
    <div className="shopping-cart">
      <header className="shopping-cart__header">
        <p className="shopping-cart__eyebrow">Demo experience</p>
        <h2>Virgin Airlines</h2>
        <p className="shopping-cart__subtitle">
          Check out some of our Premium services.
        </p>
      </header>

      <div className="shopping-cart__grid">
        {products.map((product) => {
          const quantity = cart[product.id] || 0;
          return (
            <div className="product-card" key={product.id}>
              <div>
                {/* <p className="product-card__category">{product.category}</p> */}
                <h3>{product.name}</h3>
                {/* <p className="product-card__description">{product.description}</p> */}
              </div>

              <div className="product-card__footer">
                <div className="product-card__price">
                  {formatCurrency(product.price)}
                </div>
                <div className="product-card__quantity">
                  <button
                    type="button"
                    className="quantity-btn"
                    onClick={() => onDecrement(product.id)}
                    disabled={quantity === 0}
                    aria-label={`Remove ${product.name}`}
                  >
                    –
                  </button>
                  <span>{quantity}</span>
                  <button
                    type="button"
                    className="quantity-btn"
                    onClick={() => onIncrement(product.id)}
                    aria-label={`Add ${product.name}`}
                  >
                    +
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="cart-summary">
        <div>
          <p className="cart-summary__label">Cart total</p>
          <p className="cart-summary__value">{formatCurrency(totalAmount)}</p>
        </div>
        <button
          type="button"
          className="cart-summary__continue"
          onClick={onContinue}
          disabled={continueDisabled}
        >
          Continue to payment
        </button>
      </div>
    </div>
  );
}


