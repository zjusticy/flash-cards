type DrawerParams = {
  isOpen: boolean;
  onClose: () => void;
  children: JSX.Element;
};

const Drawer = ({ isOpen, children, onClose }: DrawerParams) => (
  <div
    aria-hidden={isOpen ? "false" : "true"}
    className={isOpen ? "drawerContainer drawerOpen" : "drawerContainer"}
  >
    <div className="drawer drawerLeft" role="dialog">
      {children}
    </div>
    <div
      className="drawerBackdrop"
      onClick={onClose}
      onKeyDown={onClose}
      role="button"
      aria-label="Close drawer"
      tabIndex={0}
    />
  </div>
);

export default Drawer;
