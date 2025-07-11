"use client";

type Props = {
  width?: string
  height?: string
  lighter?: boolean
}

export const FileDuoToneBlack = ({ lighter, width, height }: Props) => {
  const mainFill = lighter === true ? "#4B4B4B" : "#292929"
  const accentFill = lighter === true ? "#7A7A7A" : "#545454"

  return (
    <svg
      width={width || "24"}
      height={height || "24"}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M3 5C3 3.34315 4.34315 2 6 2H15.7574C16.553 2 17.3161 2.31607 17.8787 2.87868L20.1213 5.12132C20.6839 5.68393 21 6.44699 21 7.24264V19C21 20.6569 19.6569 22 18 22H6C4.34315 22 3 20.6569 3 19V5Z"
        fill={mainFill}
      />
      <path
        d="M17.7071 2.70711L20.2929 5.29289C20.7456 5.74565 21 6.35971 21 7H18C16.8954 7 16 6.10457 16 5V2C16.6403 2 17.2544 2.25435 17.7071 2.70711Z"
        fill={accentFill}
      />
    </svg>
  )
}
