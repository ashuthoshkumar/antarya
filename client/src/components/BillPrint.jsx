export default function BillPrint({ cart, total, customer, paymentMode }) {
  return (
    <div className="bg-white p-6 w-80 font-mono text-sm">
      <div className="text-center mb-4">
        <h2 className="font-bold text-lg">ANTARYA</h2>
        <p>Kirana Store</p>
        <p>{new Date().toLocaleString()}</p>
      </div>
      <div className="border-t border-b py-2 mb-2">
        {cart.map((c, i) => (
          <div key={i} className="flex justify-between">
            <span>{c.name} x{c.qty}</span>
            <span>₹{c.price * c.qty}</span>
          </div>
        ))}
      </div>
      <div className="flex justify-between font-bold text-lg">
        <span>TOTAL</span>
        <span>₹{total}</span>
      </div>
      <div className="mt-4 text-center">
        <p>Payment: {paymentMode.toUpperCase()}</p>
        {customer && <p>Customer: {customer}</p>}
        <p className="mt-2">Thank you! 🙏</p>
      </div>
    </div>
  );
}