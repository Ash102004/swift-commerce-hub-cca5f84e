import { motion, HTMLMotionProps, Variants } from 'framer-motion';
import { ReactNode, forwardRef } from 'react';

// Animation Variants
export const fadeInUp: Variants = {
  hidden: { 
    opacity: 0, 
    y: 20 
  },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: {
      duration: 0.5,
      ease: [0.25, 0.46, 0.45, 0.94]
    }
  }
};

export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1,
    transition: { duration: 0.4 }
  }
};

export const scaleIn: Variants = {
  hidden: { 
    opacity: 0, 
    scale: 0.95 
  },
  visible: { 
    opacity: 1, 
    scale: 1,
    transition: {
      duration: 0.3,
      ease: [0.25, 0.46, 0.45, 0.94]
    }
  }
};

export const slideInRight: Variants = {
  hidden: { 
    opacity: 0, 
    x: 30 
  },
  visible: { 
    opacity: 1, 
    x: 0,
    transition: {
      duration: 0.4,
      ease: [0.25, 0.46, 0.45, 0.94]
    }
  }
};

export const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1
    }
  }
};

export const staggerItem: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
      ease: [0.25, 0.46, 0.45, 0.94]
    }
  }
};

// Reusable Motion Components
interface MotionCardProps extends HTMLMotionProps<'div'> {
  children: ReactNode;
  delay?: number;
}

export const MotionCard = forwardRef<HTMLDivElement, MotionCardProps>(
  ({ children, delay = 0, className = '', ...props }, ref) => (
    <motion.div
      ref={ref}
      initial="hidden"
      animate="visible"
      variants={fadeInUp}
      transition={{ delay }}
      whileHover={{ 
        y: -4, 
        boxShadow: '0 12px 30px -8px hsl(35, 20%, 20%, 0.15)',
        transition: { duration: 0.3 }
      }}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  )
);
MotionCard.displayName = 'MotionCard';

interface MotionListProps {
  children: ReactNode;
  className?: string;
}

export const MotionList = ({ children, className = '' }: MotionListProps) => (
  <motion.div
    initial="hidden"
    animate="visible"
    variants={staggerContainer}
    className={className}
  >
    {children}
  </motion.div>
);

export const MotionListItem = ({ children, className = '' }: MotionListProps) => (
  <motion.div variants={staggerItem} className={className}>
    {children}
  </motion.div>
);

interface MotionButtonProps extends HTMLMotionProps<'button'> {
  children: ReactNode;
}

export const MotionButton = forwardRef<HTMLButtonElement, MotionButtonProps>(
  ({ children, className = '', ...props }, ref) => (
    <motion.button
      ref={ref}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      transition={{ duration: 0.2 }}
      className={className}
      {...props}
    >
      {children}
    </motion.button>
  )
);
MotionButton.displayName = 'MotionButton';

interface MotionPageProps {
  children: ReactNode;
  className?: string;
}

export const MotionPage = ({ children, className = '' }: MotionPageProps) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    transition={{ duration: 0.3 }}
    className={className}
  >
    {children}
  </motion.div>
);

export const MotionSection = ({ children, className = '' }: MotionPageProps) => (
  <motion.section
    initial="hidden"
    whileInView="visible"
    viewport={{ once: true, margin: '-100px' }}
    variants={fadeInUp}
    className={className}
  >
    {children}
  </motion.section>
);

// Stats Card with Counter Animation
interface MotionStatProps {
  value: number | string;
  label: string;
  icon: ReactNode;
  delay?: number;
  suffix?: string;
}

export const MotionStat = ({ value, label, icon, delay = 0, suffix = '' }: MotionStatProps) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay, duration: 0.5 }}
    whileHover={{ 
      y: -4,
      transition: { duration: 0.2 }
    }}
    className="card-royal rounded-none p-6"
  >
    <div className="flex items-center gap-4">
      <motion.div 
        className="w-14 h-14 border-2 border-primary flex items-center justify-center bg-primary/5"
        whileHover={{ rotate: 5, scale: 1.05 }}
        transition={{ duration: 0.2 }}
      >
        {icon}
      </motion.div>
      <div>
        <p className="text-sm text-muted-foreground font-display">{label}</p>
        <motion.p 
          className="text-2xl font-display font-semibold gold-text"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: delay + 0.2 }}
        >
          {value}{suffix}
        </motion.p>
      </div>
    </div>
  </motion.div>
);

// Hover Card Effect
export const hoverScale = {
  whileHover: { scale: 1.02 },
  whileTap: { scale: 0.98 },
  transition: { duration: 0.2 }
};

export const hoverLift = {
  whileHover: { 
    y: -4,
    boxShadow: '0 12px 30px -8px hsl(35, 20%, 20%, 0.15)'
  },
  transition: { duration: 0.3 }
};
