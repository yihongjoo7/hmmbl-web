export interface QuizLayoutProps {
  children: React.ReactNode;
}

export default function QuizLayout(props: QuizLayoutProps) {
  const { children } = props;
  return (
    <section
      className="z-10 
      flex flex-col flex-1 overflow-hidden
      -mt-6 py-7 px-6 rounded-t-[20px] 
      bg-white h-full
      "
    >
      {children}
    </section>
  );
}
