import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'; 
import { coldarkCold, coldarkDark } from 'react-syntax-highlighter/dist/esm/styles/prism'
import styles from './styles.module.css';
import { varela_round } from '@/app/fonts/fonts';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import { codeToHtml } from 'shiki'


type Params = {
  text: string;
};

export default function FormattedText({ text }: Params) {
  const isDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const theme = isDarkMode ? coldarkDark : coldarkCold;
  const handleCopy = (code: string) => {
    navigator.clipboard.writeText(code);
  };

  return (
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeRaw]}
        components={{
          h1: ({...props}) => <h1 className={styles.title1} {...props} />,
          h2: ({...props}) => <h2 className={styles.title2} {...props} />,
          h3: ({...props}) => <h3 className={styles.title3} {...props} />,
          h4: ({...props}) => <h4 className={styles.title4} {...props} />,
          h5: ({...props}) => <h5 className={styles.title5} {...props} />,
          h6: ({...props}) => <h6 className={styles.title6} {...props} />,
          table: ({...props}) => ( <div className={styles.tableContainer}> <table className={styles.table} {...props} /> </div>),
          th: ({...props}) => <th className={styles.th} {...props} />,
          td: ({...props}) => <td className={styles.td} {...props} />,
          ul: ({...props}) => <ul className={styles.ul} {...props} />,
          li: ({...props}) => <li className={styles.li} {...props} />,
          sup: ({...props}) => <sup className={styles.sup} {...props} />,
          sub: ({...props}) => <sub className={styles.sub} {...props} />,
          code({className, children, ...props }) { 
            const match = /language-(\w+)/.exec(className || '')
              return match ? ( 
               <div className={styles.container_code}>
                 <div className={styles.container_header}>
                  <p className={`${styles.language} ${varela_round.className}`}>{match[1]}</p>

                  <button onClick={() => handleCopy(String(children).replace(/\n$/, ''))}>
                    <ContentCopyIcon style={{color:"white"}} />
                  </button>
                 </div>

                  <SyntaxHighlighter 
                      style={theme} 
                      language={match[1]}
                      PreTag='div'
                      showLineNumbers
                      lineProps={{style: {wordBreak: 'break-all', whiteSpace: 'pre-wrap'}}}
                      className={`${styles.codeblock} ${varela_round.className}`}
                    >
                      {String(children).replace(/\n$/, '')}
                    </SyntaxHighlighter>
               </div>
                ) :  ( 
                  <code className={styles.codeLine} {...props}> {children} </code> 
              );
            }
        }}
      >
        {text}
      </ReactMarkdown>
  );
}