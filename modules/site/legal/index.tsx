import PolicyContent from "./privacy-policy"
import TermsOfUse from "./terms-of-use"

const LegalIndex = ({id}: {id: "policy" | "terms"}) => {

  return (
    <>
      {id==="policy"? <PolicyContent />: <TermsOfUse />}
    </>
  )
}

export default LegalIndex