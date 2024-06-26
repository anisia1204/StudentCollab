package com.licenta.config;

import com.licenta.config.service.JwtService;
import com.licenta.context.UserContextHolder;
import com.licenta.domain.repository.UserJPARepository;
import com.licenta.service.exception.UserNotFoundException;
import org.springframework.lang.NonNull;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import javax.servlet.FilterChain;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

@Component
public class JwtAuthFilter extends OncePerRequestFilter {

    private final JwtService jwtService;
    private final UserDetailsService userDetailsService;
    private final UserJPARepository userJPARepository;

    public JwtAuthFilter(JwtService jwtService, UserDetailsService userDetailsService, UserJPARepository userJPARepository) {
        this.jwtService = jwtService;
        this.userDetailsService = userDetailsService;
        this.userJPARepository = userJPARepository;
    }

    @Override
    protected void doFilterInternal(@NonNull HttpServletRequest request,
                                    @NonNull HttpServletResponse response,
                                    @NonNull FilterChain filterChain) throws ServletException, IOException {
        final String authHeader = request.getHeader("Authorization");
        final String jwtToken;
        final String userEmail;

        if(authHeader == null || !(authHeader.startsWith("Bearer "))){
            filterChain.doFilter(request, response);
            return;
        }

        jwtToken = authHeader.substring(7);
        userEmail = jwtService.extractUserEmail(jwtToken);
        if(userEmail != null && SecurityContextHolder.getContext().getAuthentication() == null) {
            UserDetails userDetails = userDetailsService.loadUserByUsername(userEmail);
            Long userId = getUserIdByUserEmail(userEmail);
            UserContextHolder.setUserContext(new UserContextHolder.UserContext(userDetails, userId));
            if(jwtService.isTokenValid(jwtToken, userDetails)) {
                UsernamePasswordAuthenticationToken authenticationToken = new UsernamePasswordAuthenticationToken(
                        userDetails,
                        null,
                        userDetails.getAuthorities()
                );
                authenticationToken.setDetails(
                        new WebAuthenticationDetailsSource().buildDetails(request)
                );
                SecurityContextHolder.getContext().setAuthentication(authenticationToken);
            }
        }
        filterChain.doFilter(request, response);
    }

    private Long getUserIdByUserEmail(String username) {
        return this.userJPARepository.findByEmail(username).orElseThrow(UserNotFoundException::new).getId();
    }
}


