// 'use client'

// import React, { useState } from 'react'
// import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
// import { Button } from "@/components/ui/button"
// import Image from "next/image"
// import { UserWithRelations } from '@/types'
// import { motion } from "framer-motion"
// import { Loader2 } from "lucide-react"

// interface VoteModalProps {
//   isOpen: boolean
//   onClose: () => void
//   onVote: (userId: number) => Promise<void>
//   users: UserWithRelations[]
// }

// export function VoteModal({ isOpen, onClose, onVote, users }: VoteModalProps) {
//   const [selectedUser, setSelectedUser] = useState<number | null>(null)
//   const [isVoting, setIsVoting] = useState(false)
  
//   const handleVote = async () => {
//     if (selectedUser !== null) {
//       setIsVoting(true)
//       try {
//         await onVote(selectedUser)
//       } finally {
//         setIsVoting(false)
//         onClose()
//       }
//     }
//   }

//   return (
//     <Dialog open={isOpen} onOpenChange={(open) => !isVoting && onClose()}>
//       <DialogContent className="sm:max-w-[600px] bg-white" aria-describedby="voting-modal">
//         <DialogHeader>
//           <DialogTitle className="text-lg font-bold text-center font-mono">Vote for the Coolest PFP</DialogTitle>
//         </DialogHeader>
//         {users.length === 0 ? (
//           <p className="text-center text-lg">No more users available!</p>
//         ) : (
//           <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
//             {users.map((user) => (
//               <motion.div
//                 key={user.id}
//                 className={`relative p-2 border rounded-lg cursor-pointer overflow-hidden ${
//                   selectedUser === user.id ? 'border-blue-500 ring-2 ring-blue-300' : 'border-gray-200'
//                 }`}
//                 onClick={() => !isVoting && setSelectedUser(user.id)}
//                 whileHover={{ y: -3, transition: { duration: 0.2 } }}
//               >
//                 <div className={`absolute inset-0 bg-gradient-to-bl from-gray-200 via-gray-100 to-gray-200 opacity-60 animate-gradient-diagonal-slow`}></div>
//                 <div className="relative z-10">
//                   <div className="relative w-full pb-[100%] mb-1">
//                     <Image
//                       src={user.pfpUrl || "/fallbackAvatar.png"}
//                       alt={`${user.username || 'User'}'s profile picture`}
//                       layout="fill"
//                       objectFit="cover"
//                       className="rounded-md shadow-sm"
//                     />
//                   </div>
//                   <h2 className="text-xs font-semibold text-center text-gray-800 truncate">
//                     {user.username || 'Anonymous'}
//                   </h2>
//                   <p className="text-xs text-center text-green-600">
//                     Votes: {user.votesReceived.length}
//                   </p>
//                 </div>
//               </motion.div>
//             ))}
//           </div>
//         )}
//         <Button 
//           onClick={handleVote} 
//           disabled={selectedUser === null || isVoting}
//           className="w-full mt-4 text-sm font-semibold"
//         >
//           {isVoting ? (
//             <>
//               <Loader2 className="mr-2 h-4 w-4 animate-spin" />
//               Submitting...
//             </>
//           ) : (
//             'Submit Vote'
//           )}
//         </Button>
//       </DialogContent>
//     </Dialog>
//   )
// }






// new one
'use client'

import React, { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import { UserWithRelations } from '@/types'
import { motion } from "framer-motion"
import { Loader2 } from "lucide-react"

interface VoteModalProps {
  isOpen: boolean
  onClose: () => void
  onVote: (userId: number) => Promise<void>
  users: UserWithRelations[]
}

export function VoteModal({ isOpen, onClose, onVote, users }: VoteModalProps) {
  const [selectedUser, setSelectedUser] = useState<number | null>(null)
  const [isVoting, setIsVoting] = useState(false)
  
  const handleVote = async () => {
    if (selectedUser !== null) {
      setIsVoting(true)
      try {
        await onVote(selectedUser)
      } finally {
        setIsVoting(false)
        onClose()
      }
    }
  }

  const products = [
    { name: "auralized", url: "https://auralized.com", logo: "/aura.png" },
    // { name: "infinifi", url: "https://infinifi.cafe", logo: "/infini-cafe-logo.png" },
    // { name: "paneldasu", url: "https://paneldasu.com", logo: "/logos/paneldasu-logo.png" },
    { name: "dingboard", url: "https://dingboard.com", logo: "/dingboard-logo.png" },
    // { name: "ArtSCII", url: "https://artscii.onrender.com", logo: "/logos/artscii-logo.png" },
    { name: "rarepepes", url: "https://rarepepes.net/search", logo: "/rp2.png" }
  ]

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !isVoting && onClose()}>
      <DialogContent className="sm:max-w-[600px] bg-white" aria-describedby="voting-modal">
        <DialogHeader>
          <DialogTitle className="text-lg font-bold text-center font-mono">Vote for the Coolest PFP</DialogTitle>
        </DialogHeader>
        {users.length < 4 ? (
          <div className="text-center">
            <p className="text-lg mb-4">No more users left to vote. Try again in 60 minutes.</p>
            <p className="text-md font-semibold mb-2">Meanwhile, check out these awesome products:</p>
            <div className="grid grid-cols-3 gap-4">
              {products.map((product, index) => (
                <a
                  key={index}
                  href={product.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex flex-col items-center p-2 border rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <div className="w-12 h-12 relative mb-2">
                    <Image
                      src={product.logo}
                      alt={`${product.name} logo`}
                      layout="fill"
                      objectFit="contain"
                    />
                  </div>
                  <span className="text-xs font-medium text-center">{product.name}</span>
                </a>
              ))}
              
            </div>
            <p className='text-center mt-3'>check out more on <a href='https://tpottools.com/' className='text-blue-800'>tpottools.com</a></p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {users.map((user) => (
              <motion.div
                key={user.id}
                className={`relative p-2 border rounded-lg cursor-pointer overflow-hidden ${
                  selectedUser === user.id ? 'border-blue-500 ring-2 ring-blue-300' : 'border-gray-200'
                }`}
                onClick={() => !isVoting && setSelectedUser(user.id)}
                whileHover={{ y: -3, transition: { duration: 0.2 } }}
              >
                <div className={`absolute inset-0 bg-gradient-to-bl from-gray-200 via-gray-100 to-gray-200 opacity-60 animate-gradient-diagonal-slow`}></div>
                <div className="relative z-10">
                  <div className="relative w-full pb-[100%] mb-1">
                    <Image
                      src={user.pfpUrl || "/fallbackAvatar.png"}
                      alt={`${user.username || 'User'}'s profile picture`}
                      layout="fill"
                      objectFit="cover"
                      className="rounded-md shadow-sm"
                    />
                  </div>
                  <h2 className="text-xs font-semibold text-center text-gray-800 truncate">
                    {user.username || 'Anonymous'}
                  </h2>
                  <p className="text-xs text-center text-green-600">
                    Votes: {user.votesReceived.length}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        )}
        {users.length >= 4 && (
          <Button 
            onClick={handleVote} 
            disabled={selectedUser === null || isVoting}
            className="w-full mt-4 text-sm font-semibold"
          >
            {isVoting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Submitting...
              </>
            ) : (
              'Submit Vote'
            )}
          </Button>
        )}
      </DialogContent>
    </Dialog>
  )
}