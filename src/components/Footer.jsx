export default function Footer() {
  return (
    <footer>
      <div>
        <p>&copy; {new Date().getFullYear()} GreenQuest. All rights reserved.</p>
        <ul>
          <li>About</li>
          <li>Contact</li>
          <li>Privacy Policy</li>
        </ul>
      </div>
    </footer>
  );
}