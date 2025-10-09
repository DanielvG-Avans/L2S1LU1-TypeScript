const Navbar = () => {
  return (
    <header className="container mx-auto p-4 flex justify-between items-center">
      <h1>My Website</h1>
      <nav>
        <ul className="flex space-x-4">
          <li>Home</li>
          <li>About</li>
          <li>Contact</li>
        </ul>
      </nav>
      <div>
        <div>CTA</div>
      </div>
    </header>
  );
};

export default Navbar;
