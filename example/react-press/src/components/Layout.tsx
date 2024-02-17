import Nav from "./Nav"
import Footer from "./Footer"
import Meta from "./Meta"

type Props = {
    preview?: boolean
    children: React.ReactNode
}

const Layout = ({ children }: Props) => {
    return (
        <>
            <Meta />
            <Nav />
            <div className="min-h-screen">
                <main role="main">
                    <main>{children}</main>
                </main>
            </div>
            <Footer />
        </>
    )
}

export default Layout
