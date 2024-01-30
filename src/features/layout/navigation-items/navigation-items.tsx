import Button from "@/features/ui/button/button";

type Props = {
  todo: () => void;
  logout: () => void;
  signin: () => void;
  localDB: boolean;
  branch: boolean;
};

const NavigationItems = ({ branch, signin, localDB, todo, logout }: Props) => (
  <ul
    className="m-0 p-0 list-none flex flex-col items-center \ 
  bg-white border border-solid border-[color:rgba(0, 0, 0, 0.1)] [&_li]:last:border-b-0"
  >
    {branch && (
      <li
        className="list-item w-[98px] text-center border border-solid \
      border-[color:rgba(0, 0, 0, 0.1)] h-full"
      >
        <Button
          className="text-[0.75rem] h-12 hover:cursor-pointer \
          hover:bg-[color:rgba(0, 0, 0, 0.1)]"
          clicked={todo}
          elementType="normal"
        >
          Delete
        </Button>
      </li>
    )}
    <li
      className="list-item w-[98px] text-center border border-solid \
      border-[color:rgba(0, 0, 0, 0.1)] h-full"
    >
      <Button
        className="text-[0.75rem] h-12 hover:cursor-pointer \
          hover:bg-[color:rgba(0, 0, 0, 0.1)]"
        clicked={localDB ? signin : logout}
        elementType="normal"
      >
        {localDB ? "Sign in" : "Log out"}
      </Button>
    </li>
  </ul>
);

export default NavigationItems;
