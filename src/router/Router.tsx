import { Route, Routes } from "react-router-dom"
import Core from "../features/core/Core"
import { memo } from "react"
import { Page404 } from "../components/pages/Page404";
import { HeaderLayout } from "../components/template/HeaderLayout";
import { MyPage } from "../components/pages/MyPage";
import { MyPlaylists } from "../components/pages/MyPlaylists";
import { Connection } from "../components/pages/Connection";
import SearchAudio from "../components/pages/SearchAudio";
import AnalyseAudio from "../components/pages/AnalyseAudio";

export const Router: React.FC = memo(() => {
  return (
    <Routes>
      <Route path="/" element={<HeaderLayout />} >
          <Route index element={<Core />} />
          <Route path="mypage" element={<MyPage />} />
          <Route path="user/:userId" element={<MyPage />} />
          <Route path="user/:userId/followers" element={<Connection />} />
          <Route path="user/:userId/following" element={<Connection />} />
          <Route path="mypage/myplaylists" element={<MyPlaylists />} />
          <Route path="analyse" element={<AnalyseAudio />} />
          <Route path="search" element={<SearchAudio />} />
          <Route path="*" element={<Page404 />} />
      </Route>
      <Route path="*" element={<Page404 />} />
    </Routes>
  )
});