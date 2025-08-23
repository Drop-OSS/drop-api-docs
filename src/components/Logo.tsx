export function Logo(props: React.ComponentPropsWithoutRef<'svg'>) {
  return (
    <div className="flex flex-row items-center gap-x-2 font-semibold">
      <svg
        aria-label="Drop Logo"
        className="mt-[1px] h-6 text-blue-400"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M4 13.5C4 11.0008 5.38798 8.76189 7.00766 7C8.43926 5.44272 10.0519 4.25811 11.0471 3.5959C11.6287 3.20893 12.3713 3.20893 12.9529 3.5959C13.9481 4.25811 15.5607 5.44272 16.9923 7C18.612 8.76189 20 11.0008 20 13.5C20 17.9183 16.4183 21.5 12 21.5C7.58172 21.5 4 17.9183 4 13.5Z"
          stroke="currentColor"
          strokeWidth="2"
        />
      </svg>
      Developer API
    </div>
  )
}
