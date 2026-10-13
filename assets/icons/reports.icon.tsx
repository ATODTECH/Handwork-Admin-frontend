import { SvgProps } from "@/types/svg"

export const ReportsIcon = (props: SvgProps) => {
  return (
    <svg 
      width="20" 
      height="20" 
      viewBox="0 0 20 20" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path d="M10 12.8334V16.1667" stroke={props.color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M12.668 11.5V16.1667" stroke={props.color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M15.332 8.83331V16.1666" stroke={props.color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M16.6654 4.16669L10.9014 9.93069C10.8704 9.96173 10.8336 9.98636 10.7931 10.0032C10.7526 10.02 10.7092 10.0286 10.6654 10.0286C10.6215 10.0286 10.5781 10.02 10.5376 10.0032C10.4971 9.98636 10.4603 9.96173 10.4294 9.93069L8.2347 7.73602C8.17219 7.67353 8.08742 7.63842 7.99903 7.63842C7.91064 7.63842 7.82587 7.67353 7.76336 7.73602L3.33203 12.1667" stroke={props.color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M4.66797 14.1667V16.1667" stroke={props.color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M7.33203 11.5V16.1667" stroke={props.color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  )
}