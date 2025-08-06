const creditPacks = [
  
  {
    label: '30 Credits',
    price: '£3.00',
    url: 'https://buy.stripe.com/test_7sYaEX1UUatJcQ4cLua7C00',
  },
  {
    label: '60 Credits',
    price: '£6.00',
    url: 'https://buy.stripe.com/test_eVqdR90QQdFV7vK5j2a7C01',
  },
];

export default function Store() {
  return (
    <div>
      <h2>Buy Sleeping AI Credits</h2>
      {creditPacks.map(pack => (
        <div key={pack.label} style={{marginBottom: 24, padding: 16, border: '1px solid #ddd', borderRadius: 10}}>
          <h3>{pack.label}</h3>
          <p>{pack.price}</p>
          <a
            href={pack.url}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'inline-block',
              background: 'linear-gradient(90deg,#5c258d,#4389a2)',
              color: '#fff',
              padding: '10px 22px',
              borderRadius: 8,
              textDecoration: 'none',
              fontWeight: 600,
            }}
          >Buy Now</a>
        </div>
      ))}
    </div>
  );
}
